
from celery import shared_task
from apps.projects.models import Project
from .market_analyst_agent import MarketAnalystAgent
from .design_agent import DesignAgent
from .code_generation_agent import CodeGenAgent

@shared_task(bind=True)
def run_market_analysis(self, project_id: int):
    """
    Celery task to execute the Market Analyst Agent.
    """
    try:
        project = Project.objects.get(id=project_id)
        project.status = Project.ProjectStatus.ANALYSIS_PENDING
        project.save()

        agent = MarketAnalystAgent()
        agent.execute(project_id=project_id)
        # The agent's execute method now sets the status to ANALYSIS_COMPLETE
    except Project.DoesNotExist as e:
        print(f"Project {project_id} not found for market analysis.")
        raise self.retry(exc=e, countdown=60) # Retry in 60s if DB is slow
    except Exception as e:
        Project.objects.filter(id=project_id).update(status=Project.ProjectStatus.FAILED)
        print(f"Error during market analysis for project {project_id}: {e}")
        raise

@shared_task(bind=True)
def run_design_analysis(self, project_id: int):
    """
    Celery task to execute the Design Agent.
    """
    try:
        project = Project.objects.get(id=project_id)
        if project.status != Project.ProjectStatus.ANALYSIS_COMPLETE:
            raise Exception("Cannot run design analysis: Market analysis is not yet complete.")

        project.status = Project.Project_Status.DESIGN_PENDING
        project.save()

        agent = DesignAgent()
        agent.execute(project_id=project_id)
        # The agent's execute method now sets the status to DESIGN_COMPLETE
    except Project.DoesNotExist as e:
        print(f"Project {project_id} not found for design analysis.")
        raise self.retry(exc=e, countdown=60)
    except Exception as e:
        Project.objects.filter(id=project_id).update(status=Project.ProjectStatus.FAILED)
        print(f"Error during design analysis for project {project_id}: {e}")
        raise

@shared_task(bind=True)
def run_code_generation(self, project_id: int):
    """
    Celery task to execute the Code Generation Agent after successful payment.
    """
    try:
        project = Project.objects.get(id=project_id)
        # Final check for payment and status before running the most expensive task
        if project.status == Project.ProjectStatus.DESIGN_COMPLETE and project.payments.filter(status='SUCCESSFUL').exists():
            project.status = Project.ProjectStatus.CODE_GENERATION
            project.save()

            agent = CodeGenAgent()
            agent.execute(project_id=project.id)
            # The agent's execute method now sets the status to COMPLETED
        else:
            raise Exception("Cannot run code generation: Prerequisities (design complete & payment) not met.")
    except Project.DoesNotExist as e:
        print(f"Project {project_id} not found for code generation.")
        raise self.retry(exc=e, countdown=60)
    except Exception as e:
        Project.objects.filter(id=project_id).update(status=Project.ProjectStatus.FAILED)
        print(f"Error during code generation for project {project_id}: {e}")
        raise
