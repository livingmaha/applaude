from rest_framework import viewsets, permissions
from .models import Project, Testimonial, MobileApp
from .serializers import ProjectSerializer, TestimonialSerializer, MobileAppSerializer
from ratelimit.decorators import ratelimit

class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to interact with it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the owner of the project.
        return obj.owner == request.user

class ProjectViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows projects to be viewed or edited.
    Ensures that users can only interact with their own projects.
    """
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    @ratelimit(key='user', rate='10/m', method='GET', block=True)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @ratelimit(key='user', rate='5/m', method='POST', block=True)
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


    def get_queryset(self):
        """
        This view should return a list of all the projects
        for the currently authenticated user, prefetching related apps
        to optimize database queries.
        """
        user = self.request.user
        return Project.objects.filter(owner=user).prefetch_related('apps', 'testimonials')

    def perform_create(self, serializer):
        """
        Assign the current user as the owner of the project upon creation.
        """
        serializer.save(owner=self.request.user)


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for testimonials. For this launch, it is read-only.
    """
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Return testimonials for projects owned by the current user.
        """
        user = self.request.user
        return Testimonial.objects.filter(project__owner=user).select_related('project')


class MobileAppViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for viewing mobile app code snippets.
    This is now read-only as creation is handled with the project.
    """
    serializer_class = MobileAppSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Return mobile apps for projects owned by the current user.
        """
        user = self.request.user
        return MobileApp.objects.filter(project__owner=user).select_related('project')
