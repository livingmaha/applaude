from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Project, Testimonial, MobileApp
from .serializers import ProjectSerializer, TestimonialSerializer, MobileAppSerializer

class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit or view it.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user

class ProjectViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows projects to be viewed or edited.
    Ensures that users can only interact with their own projects.
    """
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        """
        This view should return a list of all the projects
        for the currently authenticated user.
        """
        user = self.request.user
        return Project.objects.filter(owner=user).prefetch_related('testimonials', 'apps')

    def perform_create(self, serializer):
        """
        Assign the current user as the owner of the project upon creation.
        """
        serializer.save(owner=self.request.user)


class TestimonialViewSet(viewsets.ModelViewSet):
    """
    API endpoint for testimonials.
    Users can only access testimonials for projects they own.
    """
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Return testimonials for projects owned by the current user.
        """
        user = self.request.user
        return Testimonial.objects.filter(project__owner=user).select_related('project')


class MobileAppViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing mobile app uploads.
    """
    serializer_class = MobileAppSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Return mobile apps for projects owned by the current user.
        """
        user = self.request.user
        return MobileApp.objects.filter(project__owner=user).select_related('project')
