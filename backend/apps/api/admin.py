from django.contrib import admin
from .models import ApiClient

@admin.register(ApiClient)
class ApiClientAdmin(admin.ModelAdmin):
    list_display = ('business_name', 'user', 'is_active', 'apps_created_count', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('business_name', 'user__username', 'user__email', 'api_key')
    readonly_fields = ('api_key', 'created_at', 'updated_at')
    fieldsets = (
        ('Client Information', {'fields': ('user', 'business_name', 'website_link')}),
        ('API Details', {'fields': ('api_key', 'is_active', 'apps_created_count')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
