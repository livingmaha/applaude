# File: /backend/applause_api/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('apps.users.urls')),
    # Future paths for other apps will go here
    # path('api/projects/', include('apps.projects.urls')),
]
