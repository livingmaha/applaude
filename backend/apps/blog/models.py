from django.db import models
from django.conf import settings

class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    main_image_url = models.URLField(max_length=1024, blank=True, null=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blog_posts')
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
