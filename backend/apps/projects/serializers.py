
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
            'id', 'owner', 'name', 'source_url', 'analytics_data_url', 
            'app_type', 'status', 'user_persona_document', 'brand_palette',
            'enable_ux_survey', 'ux_survey_questions', # New fields
            'enable_pmf_survey', 'pmf_survey_questions', # New fields
            'app_ratings_summary', 'user_feedback_summary', 'survey_response_analytics', # New fields
            'is_premium_subscribed', # New field for subscription status
            'created_at', 'updated_at', 'status_message' # status_message already existed but ensure it's here
        ]
        read_only_fields = [
            'status', 'user_persona_document', 'brand_palette',
            'app_ratings_summary', 'user_feedback_summary', 'survey_response_analytics',
            'is_premium_subscribed', 'status_message'
        ]
