from django.db import models
from django.conf import settings

class BlogPost(models.Model):
    """
    Represents a single blog post on the platform.
    """
    title = models.CharField(max_length=200)
    content = models.TextField()
    main_image_url = models.URLField(max_length=500, blank=True, null=True, help_text="URL for the main image or video.")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='blog_posts')
    is_published = models.BooleanField(default=False, help_text="Controls whether the post is visible to the public.")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
