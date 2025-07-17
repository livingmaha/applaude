import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import apps.projects.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'applaude_api.settings.production')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            apps.projects.routing.websocket_urlpatterns
        )
    ),
})
