from .base_agent import BaseAgent
from apps.projects.models import Project
from django.db import transaction
from .prompts.super_prompts import DEVOPS_AGENT_PERSONA, DEVOPS_AGENT_GOAL

class DeploymentAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_name="DevOps Specialist",
            agent_persona=DEVOPS_AGENT_PERSONA,
            goal=DEVOPS_AGENT_GOAL
        )

    def execute(self, project_id: int):
        print(f"Executing Deployment Agent for project {project_id}...")
        project = Project.objects.get(id=project_id)
        project.status = "DEPLOYMENT_PENDING"
        project.save()

        # Simulate the deployment process
        deployment_report = f"""
        ### CI/CD Pipeline Report for Project: {project.name}

        1.  **Build Artifact Creation:** Successfully compiled and created `app-release.apk`.
        2.  **Deployment to Staging:** Deployed artifact to staging environment.
        3.  **Automated Tests:** All integration and E2E tests passed.
        4.  **Promotion to Production:** Build promoted to production.

        **Deployment Successful!**
        App is now live at: `https://cdn.applause.ai/apps/{project.id}/app.apk`
        """

        with transaction.atomic():
            project.status = "COMPLETED"
            project.status_message = "Deployment successful! Your app is live."
            project.save()

        print(f"Deployment complete for project {project_id}.")
        return deployment_report
