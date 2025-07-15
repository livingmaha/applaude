from django.contrib import admin
from django.urls import path, include
from apps.users.views import RegisterView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Admin Panel (for superuser access to all schemas)
    path('admin/', admin.site.urls),

    # Authentication endpoints for all users
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Include other shared app URLs if any in the future
]
