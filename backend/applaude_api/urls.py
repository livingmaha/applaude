from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include([
        path('users/', include('apps.users.urls')),
        path('projects/', include('apps.projects.urls')),
        path('payments/', include('apps.payments.urls')),
        path('blog/', include('apps.blog.urls')),
    ])),
]
