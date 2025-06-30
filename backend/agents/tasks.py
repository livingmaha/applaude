# File: /backend/agents/tasks.py
from celery import shared_task, chain
from .market_analyst_agent import MarketAnalystAgent
from .design_agent import DesignAgent
from apps.projects.models import Project

@shared_task
def run_market_analysis(project_id: int):
    """
    Celery task to execute the Market Analyst Agent.
    """
    try:
        project = Project.objects.get(id=project_id)
        project.status = Project.ProjectStatus.ANALYSIS_PENDING
        project.save()

        agent = MarketAnalystAgent()
        agent.execute(project_id=project_id)
    except Project.DoesNotExist:
        # Handle error: project not found
        print(f"Project {project_id} not found for market analysis.")
    except Exception as e:
        # Handle other potential errors during agent execution
        project.status = Project.ProjectStatus.FAILED
        project.save()
        print(f"Error during market analysis for project {project_id}: {e}")
        raise # Re-raise exception to let Celery know the task failed

@shared_task
def run_design_analysis(project_id: int):
    """
    Celery task to execute the Design Agent.
    """
    try:
        project = Project.objects.get(id=project_id)
        # Ensure the previous step was successful before proceeding
        if project.status != Project.ProjectStatus.ANALYSIS_COMPLETE:
            raise Exception("Market analysis not complete. Halting design analysis.")
            
        project.status = Project.ProjectStatus.DESIGN_PENDING
        project.save()

        agent = DesignAgent()
        agent.execute(project_id=project_id)
    except Project.DoesNotExist:
        print(f"Project {project_id} not found for design analysis.")
    except Exception as e:
        project.status = Project.ProjectStatus.FAILED
        project.save()
        print(f"Error during design analysis for project {project_id}: {e}")
        raise
