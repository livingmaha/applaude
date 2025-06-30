# File: /backend/apps/users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # We can add new fields here in the future
    # For example: profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    def __str__(self):
        return self.username
