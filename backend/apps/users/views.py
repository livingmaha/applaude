from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .models import CustomUser
from .serializers import CustomUserSerializer
from apps.tenants.models import Tenant, Domain

class RegisterView(generics.CreateAPIView):
    """
    Handles user registration.
    Crucially, it also creates a dedicated tenant (database schema)
    and a domain for the new user, enabling multi-tenancy.
    """
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomUserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            # Use a database transaction to ensure all or nothing is created
            with transaction.atomic():
                # Create the user instance
                user = serializer.save()

                # 1. Create the Tenant for the user
                # We'll name the tenant based on the user's username for clarity
                tenant = Tenant(
                    name=user.username,
                    schema_name=f"tenant_{user.username}_{user.id}" # Ensures a unique schema name
                )
                tenant.save()

                # 2. Associate the user with their new tenant
                user.tenant = tenant
                user.save(update_fields=['tenant'])

                # 3. Create the Domain for the tenant
                # This would be something like 'username.applause.com' in production.
                # For development, we use localhost.
                # Note: In a real production setup, you would need to configure your
                # web server (e.g., Nginx) to handle these subdomains.
                domain_name = f"{user.username}.localhost"
                domain = Domain(
                    domain=domain_name,
                    tenant=tenant,
                    is_primary=True
                )
                domain.save()

        except Exception as e:
            # If any part of the process fails, roll back the transaction
            # and return an error response.
            return Response(
                {"error": f"Failed to provision tenant: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
