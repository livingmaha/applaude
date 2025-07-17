from rest_framework import serializers
from .models import Project, MobileApp
from .utils import highlight_code
from apps.users.serializers import UserDetailSerializer

class MobileAppSerializer(serializers.ModelSerializer):
    """
    Serializer for the MobileApp model.
    Includes a field for pre-highlighted code.
    """
    highlighted_code = serializers.SerializerMethodField()

    class Meta:
        model = MobileApp
        fields = (
            'id',
            'project',
            'platform',
            'code_snippet',
            'language',
            'highlighted_code',
            'created_at',
        )

    def get_highlighted_code(self, obj: MobileApp) -> str:
        """
        Returns the highlighted HTML for the app's code snippet.
        """
        if obj.code_snippet and obj.language:
            return highlight_code(obj.code_snippet, obj.language)
        return ""


class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for the Project model.
    Optimizes database lookups and includes nested mobile apps.
    """
    owner = UserDetailSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    apps = MobileAppSerializer(many=True, read_only=True)

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
            'apps', # Include the nested apps
            'created_at',
            'updated_at'
        )
        read_only_fields = ('id', 'owner', 'status', 'status_display', 'status_message', 'created_at', 'updated_at', 'apps')

    def create(self, validated_data):
        """
        Associate the project with the currently authenticated user.
        """
        user = self.context['request'].user
        project = Project.objects.create(owner=user, **validated_data)
        # Assuming an initial code generation task might be triggered here
        # For now, we can create a placeholder MobileApp instance
        MobileApp.objects.create(
            project=project,
            platform='Android',
            language='kotlin',
            code_snippet='fun main() {\n    println("Hello, Applaude!")\n}'
        )
        return project
