from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

class Project(models.Model):
    """
    Represents a single mobile app project created by a user.
    """
    class ProjectStatus(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        ANALYSIS_PENDING = 'ANALYSIS_PENDING', _('Market Analysis Pending')
        ANALYSIS_COMPLETE = 'ANALYSIS_COMPLETE', _('Market Analysis Complete')
        DESIGN_PENDING = 'DESIGN_PENDING', _('Design Pending')
        DESIGN_COMPLETE = 'DESIGN_COMPLETE', _('Design Complete')
        PAYMENT_PENDING = 'PAYMENT_PENDING', _('Payment Pending')
        CODE_GENERATION = 'CODE_GENERATION', _('Code Generation in Progress')
        SECURITY_SCAN_PENDING = 'SECURITY_SCAN_PENDING', _('Security Scan Pending')
        SECURITY_SCAN_COMPLETE = 'SECURITY_SCAN_COMPLETE', _('Security Scan Complete')
        QA_PENDING = 'QA_PENDING', _('QA Pending')
        QA_COMPLETE = 'QA_COMPLETE', _('QA Complete')
        DEPLOYMENT_PENDING = 'DEPLOYMENT_PENDING', _('Deployment Pending')
        COMPLETED = 'COMPLETED', _('Completed')
        FAILED = 'FAILED', _('Failed')
        UPDATE_PENDING = 'UPDATE_PENDING', _('Update Pending')

    class AppType(models.TextChoices):
        ANDROID = 'ANDROID', _('Android')
        IOS = 'IOS', _('iOS')
        BOTH = 'BOTH', _('Both (Native)')

    class DeploymentOption(models.TextChoices):
        NOT_CHOSEN = 'NOT_CHOSEN', 'Not Chosen'
        APPLAUSE = 'APPLAUSE', 'Applause'
        APP_STORE = 'APP_STORE', 'App Store'
        PLAY_STORE = 'PLAY_STORE', 'Play Store'

    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    source_url = models.URLField(max_length=500)
    app_type = models.CharField(max_length=10, choices=AppType.choices, default=AppType.ANDROID)
    status = models.CharField(max_length=30, choices=ProjectStatus.choices, default=ProjectStatus.PENDING)
    status_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # AI-generated assets
    user_persona_document = models.TextField(blank=True, null=True)
    brand_palette = models.JSONField(default=dict)
    generated_code_path = models.CharField(max_length=1024, blank=True, null=True) # Link to S3 or similar
    
    # New feedback-related fields
    enable_ux_survey = models.BooleanField(default=False)
    ux_survey_questions = models.JSONField(default=list)
    enable_pmf_survey = models.BooleanField(default=True)
    pmf_survey_questions = models.JSONField(default=list)
    app_ratings_summary = models.JSONField(default=dict)
    survey_response_analytics = models.JSONField(default=dict)
    deployment_platform = models.CharField(max_length=50, blank=True, null=True)


    def __str__(self):
        return f"{self.name} by {self.owner.username}"

    class Meta:
        ordering = ['-created_at']


  
