import os
import requests
import hmac
import hashlib
import json
from decimal import Decimal
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.projects.models import Project
from .models import Payment
from .serializers import PaymentSerializer

# This will be the fixed price for app generation
APP_GENERATION_PRICE = Decimal('50.00') # Example price: $50

class InitializePaymentView(APIView):
    """
    Initialize a payment transaction for a project.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        project_id = request.data.get('project_id')
        if not project_id:
            return Response({'error': 'Project ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            project = Project.objects.get(id=project_id, owner=request.user)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found or you are not the owner.'}, status=status.HTTP_404_NOT_FOUND)

        # Create a payment record
        email = request.user.email
        amount = APP_GENERATION_PRICE
        
        payment = Payment.objects.create(
            user=request.user,
            project=project,
            amount=amount,
            email=email,
            paystack_reference=f"applause-{project_id}-{uuid.uuid4().hex[:6]}" # Generate a unique ref
        )
        
        # Call Paystack API to initialize transaction
        url = "https://api.paystack.co/transaction/initialize"
        headers = {
            "Authorization": f"Bearer {os.getenv('PAYSTACK_SECRET_KEY')}",
            "Content-Type": "application/json"
        }
        payload = {
            "email": email,
            "amount": str(amount * 100),  # Paystack expects amount in kobo
            "reference": payment.paystack_reference,
            "callback_url": f"http://localhost:5173/projects/{project.id}" # Where to redirect after payment
        }

        try:
            response = requests.post(url, headers=headers, json=payload)
            response_data = response.json()
            if response_data['status']:
                return Response(response_data['data'])
            else:
                return Response({'error': 'Failed to initialize payment with Paystack.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except requests.exceptions.RequestException as e:
            return Response({'error': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


class PaystackWebhookView(APIView):
    """
    Handle webhooks from Paystack to verify transactions.
    """
    permission_classes = [permissions.AllowAny] # Webhooks don't have auth

    def post(self, request, *args, **kwargs):
        # Verify the webhook signature
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
                payment.status = Payment.PaymentStatus.SUCCESSFUL
                payment.save()
                
                # Payment successful, now trigger the code generation agent
                # TODO: from agents.tasks import run_code_generation
                # run_code_generation.delay(payment.project.id)
                
            except Payment.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_200_OK)
