from rest_framework import serializers
from .models import Project
from apps.users.serializers import UserDetailSerializer

class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for the Project model.
    Optimizes database lookups by prefetching related owner details.
    """
    owner = UserDetailSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Project
        fields = (
            'id',
            'owner',
            'name',
            'source_url',
            'app_type',
            'status',
            'status_display',
            'status_message',
            'user_persona_document',
            'brand_palette',
            'generated_code_path',
            'created_at',
            'updated_at'
        )
        read_only_fields = ('id', 'owner', 'status', 'status_display', 'status_message', 'created_at', 'updated_at')

    def create(self, validated_data):
        """
        Associate the project with the currently authenticated user.
        """
        user = self.context['request'].user
        project = Project.objects.create(owner=user, **validated_data)
        # TODO: Trigger initial analysis task via Celery here
        # from .tasks import start_project_analysis
        # start_project_analysis.delay(project.id)
        return project
