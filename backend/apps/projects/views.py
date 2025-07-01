# backend/apps/projects/views.py
from rest_framework import viewsets, permissions
from .models import Project
from .serializers import ProjectSerializer
from agents.tasks import run_market_analysis, run_design_analysis
from celery import chain

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
        
        Optimized with select_related to pre-fetch the owner.
        """
        return Project.objects.filter(owner=self.request.user).select_related('owner').order_by('-created_at')

    def perform_create(self, serializer):
        """
        Assign the owner of the project to the logged-in user and
        kick off the asynchronous AI agent pipeline.
        """
        # First, save the project instance with the owner
        project = serializer.save(owner=self.request.user)

        # Create a chain of tasks. The design analysis will only run
        # after the market analysis successfully completes.
        # The project.id is passed as an argument to each task.
        analysis_pipeline = chain(
            run_market_analysis.s(project.id),
            run_design_analysis.s(project.id)
        )
        
        # Execute the pipeline in the background.
        analysis_pipeline.delay()
