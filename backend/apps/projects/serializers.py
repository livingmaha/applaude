from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for the Project model.
    """
    owner_email = serializers.EmailField(source='owner.email', read_only=True)
    supported_languages = serializers.JSONField()


    class Meta:
        model = Project
        fields = [
            'id', 'name', 'source_url', 'app_type', 'status', 
            'status_message', 'created_at', 'updated_at', 
            'owner_email', 'user_persona_document', 'brand_palette',
            'supported_languages', 'initial_prompt', 'requirements_document'
        ]
        read_only_fields = [
            'status', 'status_message', 'created_at', 'updated_at', 'owner_email', 'user_persona_document', 'brand_palette',
        ]
