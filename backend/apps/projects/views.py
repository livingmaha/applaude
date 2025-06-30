
from rest_framework import viewsets, permissions
from .models import Project
from .serializers import ProjectSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to view and manage their projects.
    """
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the projects
        for the currently authenticated user.
        """
        return Project.objects.filter(owner=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        """
        Assign the owner of the project to the logged-in user.
        """
        # Here we will eventually trigger the first AI agent.
        # For now, we just save the project.
        # The agent will be triggered asynchronously.
        serializer.save(owner=self.request.user)
        # TODO: Add logic to kick off the MarketAnalystAgent
        # e.g., market_analyst_agent.delay(project_id=project.id)
