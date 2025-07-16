from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('apps.users.urls')),
    path('api/projects/', include('apps.projects.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/surveys/', include('apps.surveys.urls')),
    path('api/v1/', include('apps.api.urls')),
    path('api/v1/blog/', include('apps.blog.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
]
