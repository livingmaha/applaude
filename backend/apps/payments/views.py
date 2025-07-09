import os
import requests
import hmac
import hashlib
import json
import uuid
from decimal import Decimal
from django.conf import settings
from django.db import transaction
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.projects.models import Project
from apps.users.models import CustomUser
from .models import Payment
from agents.tasks import run_code_generation
from apps.api.models import ApiClient

# Base prices in USD
BASE_PLAN_PRICES_USD = {
    'ONETIME': Decimal('50.00'),
    'MONTHLY': Decimal('15.00'),
    'YEARLY': Decimal('150.00'),
}

# Mock conversion rates for demonstration
COUNTRY_CURRENCY_CONVERSION = {
    'NG': {'currency': 'NGN', 'rate': Decimal('1400')}, # Nigeria
    'KE': {'currency': 'KES', 'rate': Decimal('130')},  # Kenya
    'GH': {'currency': 'GHS', 'rate': Decimal('15')},   # Ghana
    'FR': {'currency': 'EUR', 'rate': Decimal('0.92')},  # France
    'DE': {'currency': 'EUR', 'rate': Decimal('0.92')},  # Germany
    'JP': {'currency': 'JPY', 'rate': Decimal('155')},  # Japan
    'IN': {'currency': 'INR', 'rate': Decimal('83')},   # India
    'CN': {'currency': 'CNY', 'rate': Decimal('7.2')},   # China
    'RU': {'currency': 'RUB', 'rate': Decimal('90')},    # Russia
    'BR': {'currency': 'BRL', 'rate': Decimal('5.1')},   # Brazil
    'GB': {'currency': 'GBP', 'rate': Decimal('0.8')},   # UK
}

class GetLocalizedPricingView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        country_code = request.query_params.get('country', 'US').upper()
        
        if country_code in COUNTRY_CURRENCY_CONVERSION:
            conversion = COUNTRY_CURRENCY_CONVERSION[country_code]
            currency = conversion['currency']
            rate = conversion['rate']
            localized_prices = {plan: (price * rate).quantize(Decimal('0.01')) for plan, price in BASE_PLAN_PRICES_USD.items()}
        else:
            currency = 'USD'
            localized_prices = BASE_PLAN_PRICES_USD
            
        return Response({
            'currency': currency,
            'prices': localized_prices
        })


class InitializePaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        project_id = request.data.get('project_id')
        plan_type = request.data.get('plan_type')
        deployment_option = request.data.get('deployment_option')
        currency = request.data.get('currency', 'USD').upper()

        if not all([project_id, plan_type, deployment_option]):
            return Response({'error': 'Project ID, Plan Type, and Deployment Option are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if plan_type not in BASE_PLAN_PRICES_USD:
            return Response({'error': 'Invalid plan type.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if deployment_option not in Project.DeploymentOption.values:
            return Response({'error': 'Invalid deployment option.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            project = Project.objects.get(id=project_id, owner=request.user)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found.'}, status=status.HTTP_404_NOT_FOUND)

        project.deployment_option = deployment_option
        project.save()

        if request.user.is_superuser:
            run_code_generation.delay(project.id)
            return Response({'message': 'Superuser access granted. Code generation initiated.'}, status=status.HTTP_200_OK)

        # Calculate amount based on currency
        if currency != 'USD' and currency in [c['currency'] for c in COUNTRY_CURRENCY_CONVERSION.values()]:
            country_code = next((code for code, data in COUNTRY_CURRENCY_CONVERSION.items() if data['currency'] == currency), None)
            if country_code:
                rate = COUNTRY_CURRENCY_CONVERSION[country_code]['rate']
                amount = (BASE_PLAN_PRICES_USD[plan_type] * rate).quantize(Decimal('0.01'))
            else: # Fallback if currency is not in our direct map but supported
                amount = BASE_PLAN_PRICES_USD[plan_type]
                currency = 'USD'
        else:
            amount = BASE_PLAN_PRICES_USD[plan_type]
            currency = 'USD'

        email = request.user.email
        paystack_reference = f"applause-{project_id}-{uuid.uuid4().hex[:12]}"
        
        payment = Payment.objects.create(
            user=request.user, project=project, amount=amount,
            email=email, plan_type=plan_type, paystack_reference=paystack_reference
        )
        
        url = "https://api.paystack.co/transaction/initialize"
        headers = {
            "Authorization": f"Bearer {os.getenv('PAYSTACK_SECRET_KEY')}",
            "Content-Type": "application/json"
        }
        payload = {
            "email": email,
            "amount": str(int(amount * 100)), # Paystack requires amount in kobo/cents
            "reference": paystack_reference,
            "currency": currency,
            "callback_url": f"http://localhost:5173/projects/{project.id}?payment=success"
        }

        try:
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            response_data = response.json()
            if response_data['status']:
                return Response(response_data['data'])
            else:
                return Response({'error': f"Failed to initialize payment: {response_data.get('message')}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except requests.exceptions.RequestException as e:
            return Response({'error': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

class PaystackWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        paystack_key = os.getenv('PAYSTACK_SECRET_KEY')
        signature = request.headers.get('x-paystack-signature')
        if not signature or not hmac.compare_digest(
            signature,
            hmac.new(paystack_key.encode('utf-8'), request.body, hashlib.sha512).hexdigest()
        ):
            return Response({"message": "Invalid signature"}, status=status.HTTP_400_BAD_REQUEST)

        event_data = json.loads(request.body)
        event_type = event_data['event']
        data = event_data.get('data', {})

        if event_type == 'charge.success':
            reference = data.get('reference')
            metadata = data.get('metadata', {})
            payment_type = metadata.get('payment_type')

            with transaction.atomic():
                # Handle API Setup Fee Payment
                if payment_type == 'api_setup':
                    api_client_id = metadata.get('api_client_id')
                    try:
                        api_client = ApiClient.objects.select_for_update().get(id=api_client_id)
                        if not api_client.is_active:
                            api_client.is_active = True
                            api_client.save()
                            # Here you would typically send an email to the user with their API key
                            print(f"API Client {api_client.business_name} activated successfully.")
                    except ApiClient.DoesNotExist:
                        print(f"Webhook Error: ApiClient with ID {api_client_id} not found.")
                        return Response(status=status.HTTP_404_NOT_FOUND)
                
                # Handle standard project payment
                else:
                    try:
                        payment = Payment.objects.select_for_update().get(paystack_reference=reference)
                        if payment.status == 'PENDING':
                            payment.status = Payment.PaymentStatus.SUCCESSFUL
                            
                            # If it's a subscription, save the codes
                            if data.get('plan'):
                                payment.plan_code = data['plan'].get('plan_code')
                                payment.subscription_code = data.get('subscription', {}).get('subscription_code')
                            payment.save()
                            
                            user = payment.user
                            if payment.plan_type in ['MONTHLY', 'YEARLY']:
                                user.is_premium_subscribed = True
                                user.save(update_fields=['is_premium_subscribed'])

                            if not payment.project.status.startswith('COMPLETE'):
                                run_code_generation.delay(payment.project.id)
                    except Payment.DoesNotExist:
                        print(f"Webhook Error: Payment with reference {reference} not found.")
                        return Response(status=status.HTTP_404_NOT_FOUND)

        elif event_type == 'subscription.create':
            # This is a good place to handle the creation of a subscription for an API client
            # For simplicity in this build, we are using a one-time setup fee.
            # A usage-based billing plan would be implemented here.
            pass
        
        elif event_type in ['invoice.payment_failed', 'subscription.disabled']:
            # Deactivate user's premium or API access if subscription fails
            subscription_code = data.get('subscription_code')
            if subscription_code:
                try:
                    # Deactivate premium user
                    payment = Payment.objects.get(subscription_code=subscription_code)
                    user = payment.user
                    user.is_premium_subscribed = False
                    user.save(update_fields=['is_premium_subscribed'])
                except Payment.DoesNotExist:
                    pass
                
                try:
                    # Deactivate API client
                    api_client = ApiClient.objects.get(user__payment__subscription_code=subscription_code)
                    api_client.is_active = False
                    api_client.save()
                except ApiClient.DoesNotExist:
                    pass


        return Response(status=status.HTTP_200_OK)
