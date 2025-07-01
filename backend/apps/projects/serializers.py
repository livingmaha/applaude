
from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for the Project model.
    """
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Project
        fields = [
            'id', 'owner', 'name', 'source_url', 'app_type', 'status', 
            'status_message', 'user_persona_document', 'brand_palette',
            'enable_ux_survey', 'enable_pmf_survey', 'pmf_survey_questions',
            'app_ratings_summary', 'user_feedback_summary', 'survey_response_analytics',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'status', 'status_message', 'user_persona_document', 'brand_palette',
            'pmf_survey_questions', 'app_ratings_summary', 
            'user_feedback_summary', 'survey_response_analytics'
        ]
