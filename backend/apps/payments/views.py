import os
import requests
import hmac
import hashlib
import json
import uuid
from decimal import Decimal
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.projects.models import Project
from apps.users.models import CustomUser
from .models import Payment
from agents.tasks import run_code_generation

PLAN_PRICES = {
    'ONETIME': Decimal('50.00'),
    'MONTHLY': Decimal('15.00'),
    'YEARLY': Decimal('150.00'),
}

class InitializePaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        project_id = request.data.get('project_id')
        plan_type = request.data.get('plan_type')

        if not all([project_id, plan_type]):
            return Response({'error': 'Project ID and Plan Type are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if plan_type not in PLAN_PRICES:
            return Response({'error': 'Invalid plan type.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            project = Project.objects.get(id=project_id, owner=request.user)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.is_superuser:
            run_code_generation.delay(project.id)
            return Response({'message': 'Superuser access granted. Code generation initiated.'}, status=status.HTTP_200_OK)

        amount = PLAN_PRICES[plan_type]
        email = request.user.email
        
        # Generate a unique reference for Paystack
        paystack_reference = f"applause-{project_id}-{uuid.uuid4().hex[:12]}"
        
        payment = Payment.objects.create(
            user=request.user,
            project=project,
            amount=amount,
            email=email,
            plan_type=plan_type,
            paystack_reference=paystack_reference
        )
        
        url = "https://api.paystack.co/transaction/initialize"
        headers = {
            "Authorization": f"Bearer {os.getenv('PAYSTACK_SECRET_KEY')}",
            "Content-Type": "application/json"
        }
        payload = {
            "email": email,
            "amount": str(amount * 100),
            "reference": paystack_reference,
            "callback_url": f"http://localhost:5173/projects/{project.id}?payment=success"
        }

        try:
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            response_data = response.json()
            if response_data['status']:
                return Response(response_data['data'])
            else:
                return Response({'error': 'Failed to initialize payment.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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
            return Response(status=status.HTTP_400_BAD_REQUEST)

        event_data = json.loads(request.body)
        event_type = event_data['event']

        if event_type == 'charge.success':
            reference = event_data['data']['reference']
            try:
                payment = Payment.objects.get(paystack_reference=reference)
                if payment.status == 'PENDING':
                    payment.status = Payment.PaymentStatus.SUCCESSFUL
                    payment.save()
                    
                    user = payment.user
                    if payment.plan_type in ['MONTHLY', 'YEARLY']:
                        user.is_premium_subscribed = True
                        user.save(update_fields=['is_premium_subscribed'])

                    if not payment.project.status.startswith('COMPLETE'):
                         run_code_generation.delay(payment.project.id)
                
            except Payment.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_200_OK)
