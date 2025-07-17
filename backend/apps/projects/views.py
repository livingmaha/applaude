from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Project
from .serializers import ProjectSerializer
from celery import chain
from agents.tasks import run_market_analysis, run_code_generation, run_qa_check, run_deployment

class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the projects
        for the currently authenticated user.
        Optimize query by pre-fetching the related owner.
        """
        user = self.request.user
        return Project.objects.filter(owner=user).select_related('owner').order_by('-created_at')

    def perform_create(self, serializer):
        project = serializer.save(owner=self.request.user)

        # Create a Celery chain to execute the agent tasks sequentially
        build_chain = chain(
            run_market_analysis.s(project.id),
            run_code_generation.s(),
            run_qa_check.s(),
            run_deployment.s()
        )
        build_chain.apply_async()

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a project owned by the
        currently authenticated user.
        """
        user = self.request.user
        return Project.objects.filter(owner=user)
