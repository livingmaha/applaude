from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for the Project model.
    """
    owner_email = serializers.EmailField(source='owner.email', read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'source_url', 'app_type', 'status', 
            'status_message', 'created_at', 'updated_at', 
            'owner_email', 'user_persona_document', 'brand_palette',
            'enable_ux_survey', 'ux_survey_questions', 'enable_pmf_survey',
            'pmf_survey_questions', 'deployment_platform',
            # **MODIFIED: Add new fields for "Zero-Touch" UI**
            'initial_prompt', 'requirements_document'
        ]
        read_only_fields = [
            'status', 'status_message', 'created_at', 'updated_at', 'owner_email', 'user_persona_document', 'brand_palette',
            'pmf_survey_questions', 'app_ratings_summary', 
            'user_feedback_summary', 'survey_response_analytics'
        ]
