import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Project

class ProjectStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.project_id = self.scope['url_route']['kwargs']['project_id']
        self.project_group_name = f'project_{self.project_id}'
        self.user = self.scope["user"]

        if not self.user.is_authenticated or not await self.user_has_access():
            await self.close()
            return

        await self.channel_layer.group_add(
            self.project_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.project_group_name,
            self.channel_name
        )

    async def project_status_update(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))

    @database_sync_to_async
    def user_has_access(self):
        # Check if the user owns the project or is a superuser
        return Project.objects.filter(id=self.project_id, owner=self.user).exists() or self.user.is_superuser
