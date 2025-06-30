
from django.urls import path
from .views import InitializePaymentView, PaystackWebhookView

app_name = 'payments'

urlpatterns = [
    path('initialize/', InitializePaymentView.as_view(), name='initialize-payment'),
    path('webhook/', PaystackWebhookView.as_view(), name='paystack-webhook'),
]
