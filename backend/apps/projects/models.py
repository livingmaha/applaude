import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Project(models.Model):
    """
    Represents a single user project. Each project is owned by a user
    and serves as a container for mobile apps, testimonials, and other resources.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='projects',
        verbose_name=_('Owner')
    )
    name = models.CharField(_('Project Name'), max_length=200)
    source_url = models.URLField(_('Source URL'), max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Project')
        verbose_name_plural = _('Projects')
        # Ensure a user cannot have two projects with the same name
        unique_together = ('owner', 'name')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} by {self.owner.email}"


class MobileApp(models.Model):
    """
    Represents an uploaded mobile application file (APK/IPA) associated with a project.
    """
    class ScanStatus(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        SCANNING = 'SCANNING', _('Scanning')
        PASSED = 'PASSED', _('Passed')
        FAILED = 'FAILED', _('Failed')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='apps')
    
    # The file path in the S3 bucket, not a direct file field.
    # e.g., 'tenant_id/project_id/version/app.apk'
    file_path = models.CharField(max_length=1024)
    version = models.CharField(max_length=100)
    
    scan_status = models.CharField(
        max_length=10,
        choices=ScanStatus.choices,
        default=ScanStatus.PENDING
    )
    scan_results = models.JSONField(null=True, blank=True) # To store results from the scanner
    
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Mobile App')
        verbose_name_plural = _('Mobile Apps')
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.project.name} - v{self.version}"


class Testimonial(models.Model):
    """
    Represents a testimonial collected for a specific project.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='testimonials')
    author_name = models.CharField(max_length=100)
    author_email = models.EmailField()
    text = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5) # e.g., 1-5 stars
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Testimonial')
        verbose_name_plural = _('Testimonials')
        ordering = ['-created_at']

    def __str__(self):
        return f"Testimonial by {self.author_name} for {self.project.name}"
