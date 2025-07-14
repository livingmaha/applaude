from rest_framework import generics, permissions
from .models import BlogPost
from .serializers import BlogPostSerializer

class IsSuperUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow superusers to edit objects.
    """
    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to superusers.
        return request.user and request.user.is_superuser

class BlogPostListCreateView(generics.ListCreateAPIView):
    """
    API view to retrieve a list of blog posts or create a new one.
    Superusers can create and see all posts.
    Regular users can only see published posts.
    """
    serializer_class = BlogPostSerializer
    permission_classes = [IsSuperUserOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_superuser:
            return BlogPost.objects.all()
        return BlogPost.objects.filter(is_published=True)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class BlogPostRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update, or delete a blog post.
    """
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsSuperUserOrReadOnly]
