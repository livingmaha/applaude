from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.api.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/projects/', include('apps.projects.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/surveys/', include('apps.surveys.urls')),
    path('api/v1/', include('apps.api.urls')),
    path('api/v1/blog/', include('apps.blog.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
    path('api/testimonials/', include('apps.testimonials.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
