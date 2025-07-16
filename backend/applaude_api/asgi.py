import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import apps.api.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'applaude_api.settings')

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": AuthMiddlewareStack(
        URLRouter(
            apps.api.routing.websocket_urlpatterns
        )
    ),
})
