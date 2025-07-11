from django.db import models
from django_tenants.models import TenantMixin, DomainMixin
from apps.projects.models import Project

class Tenant(TenantMixin):
    name = models.CharField(max_length=100)
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='tenant')
    created_on = models.DateField(auto_now_add=True)

    # auto_create_schema is set to True by default
    auto_create_schema = True

    def __str__(self):
        return self.name

class Domain(DomainMixin):
    pass
