import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    """
    Custom user model that extends Django's AbstractUser.
    Includes tenant isolation and additional user profile fields.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(_('email address'), unique=True)
    
    # Tenant ID for data isolation. Each user belongs to their own tenant.
    # On user creation, this should be populated with a new UUID.
    tenant_id = models.UUIDField(default=uuid.uuid4, editable=False, db_index=True)

    # Profile information
    full_name = models.CharField(_('full name'), max_length=255, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    
    # Subscription status
    # This can be linked to a separate Subscription model
    is_subscribed = models.BooleanField(default=False)
    subscription_level = models.CharField(max_length=50, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        ordering = ['-date_joined']

    def __str__(self):
        return self.email
