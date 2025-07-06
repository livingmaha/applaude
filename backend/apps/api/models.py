import secrets
from django.db import models
from django.conf import settings

def generate_api_key():
    """
    Generates a secure, random API key.
    """
    return secrets.token_hex(32)

class ApiClient(models.Model):
    """
    Stores information about API partners and their usage.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='api_client'
    )
    business_name = models.CharField(max_length=255)
    website_link = models.URLField(max_length=500)
    api_key = models.CharField(
        max_length=64,
        unique=True,
        default=generate_api_key
    )
    is_active = models.BooleanField(
        default=False,
        help_text="Active status is set to True after successful payment."
    )
    apps_created_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.business_name} - {self.user.email}"
