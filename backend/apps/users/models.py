from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.tenants.models import Tenant

class CustomUser(AbstractUser):
    """
    Custom user model that extends the default Django user.
    Includes a direct link to a tenant.
    """
    is_premium_subscribed = models.BooleanField(default=False)
    github_token = models.CharField(max_length=255, blank=True, null=True)
    
    # Associate each user with a tenant
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='users', null=True)

    def __str__(self):
        return self.username
