
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
            'created_at', 'updated_at'
        ]
        read_only_fields = ['status', 'user_persona_document', 'brand_palette']
