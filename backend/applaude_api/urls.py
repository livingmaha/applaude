from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from .views import health_check # Import the new view

urlpatterns = [
    # Health Check
    path('health/', health_check, name='health_check'),

    # Admin
    path('admin/', admin.site.urls),

    # API V1
    path('api/v1/users/', include('apps.users.urls')),
    path('api/v1/projects/', include('apps.projects.urls')),

    # API Schema (Swagger/Redoc)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
