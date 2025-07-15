from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    is_premium_subscribed = models.BooleanField(default=False)
    # **MODIFIED: Add field for GitHub OAuth token**
    github_token = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return self.username
