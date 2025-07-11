# backend/agents/tasks.py
from celery import shared_task
from apps.projects.models import Project
from apps.surveys.models import SurveyResponse, AppRating
from .market_analyst_agent import MarketAnalystAgent
from .design_agent import DesignAgent
from .code_generation_agent import CodeGenAgent
from .qa_agent import QAAgent
from .deployment_agent import DeploymentAgent
from django.db.models import Count, Avg
import json


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
    except Project.DoesNotExist as e:
        print(f"Project {project_id} not found for market analysis.")
        raise self.retry(exc=e, countdown=60)
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

        project.status = Project.ProjectStatus.DESIGN_PENDING
        project.save()

        agent = DesignAgent()
        agent.execute(project_id=project_id)
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
        if project.status == Project.ProjectStatus.DESIGN_COMPLETE and project.payments.filter(status='SUCCESSFUL').exists():
            project.status = Project.ProjectStatus.CODE_GENERATION
            project.save()

            agent = CodeGenAgent()
            agent.execute(project_id=project.id)
        else:
            raise Exception("Cannot run code generation: Prerequisites (design complete & payment) not met.")
    except Project.DoesNotExist as e:
        print(f"Project {project_id} not found for code generation.")
        raise self.retry(exc=e, countdown=60)
    except Exception as e:
        Project.objects.filter(id=project_id).update(status=Project.ProjectStatus.FAILED)
        print(f"Error during code generation for project {project_id}: {e}")
        raise

@shared_task
def process_feedback_data(project_id):
    """
    Asynchronously processes and aggregates feedback data for a project.
    """
    project = Project.objects.get(id=project_id)
    
    # Process App Ratings
    ratings = AppRating.objects.filter(project=project)
    if ratings.exists():
        summary = ratings.values('rating').annotate(count=Count('rating')).order_by('-rating')
        project.app_ratings_summary = {item['rating']: item['count'] for item in summary}

    # Process Survey Responses
    responses = SurveyResponse.objects.filter(project=project, survey_type='PMF')
    if responses.exists():
        # This is a simplified example.
        project.survey_response_analytics = {
            'total_responses': responses.count(),
        }

    project.save()

@shared_task
def run_ai_orchestration():
    """
    The Executive Product Lead Agent's periodic task.
    """
    projects_to_check = Project.objects.filter(status='COMPLETED', enable_pmf_survey=True)
    
    for project in projects_to_check:
        analytics = project.survey_response_analytics
        if analytics and analytics.get('feature_requests'):
            for feature, percentage in analytics['feature_requests'].items():
                if percentage > 70: # Build threshold
                    print(f"Orchestrator: High demand for '{feature}' in project {project.name}. Triggering update.")
                    run_code_generation.delay(project.id, update_feature=feature)
                    project.status = Project.ProjectStatus.UPDATE_PENDING
                    project.save()
                    break

@shared_task(bind=True)
def run_qa_check(self, project_id: int):
    """Celery task to execute the QA Agent."""
    try:
        agent = QAAgent()
        agent.execute(project_id=project_id)
    except Exception as e:
        Project.objects.filter(id=project_id).update(status=Project.ProjectStatus.FAILED)
        print(f"Error during QA check for project {project_id}: {e}")
        raise

@shared_task(bind=True)
def run_deployment(self, project_id: int):
    """Celery task to execute the Deployment Agent."""
    try:
        agent = DeploymentAgent()
        agent.execute(project_id=project_id)
    except Exception as e:
        Project.objects.filter(id=project_id).update(status=Project.ProjectStatus.FAILED)
        print(f"Error during deployment for project {project_id}: {e}")
        raise
