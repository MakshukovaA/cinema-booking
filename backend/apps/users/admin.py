from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

try:
    from backend.apps.users.models import UserProfile
except ImportError:
    UserProfile = None

User = get_user_model()

if User in admin.site._registry:
    admin.site.unregister(User)

class CustomUserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser',
                       'groups', 'user_permissions')
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {'classes': ('wide',),
                'fields': ('username', 'email', 'password1', 'password2')}),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    search_fields = ('username', 'email')
    ordering = ('username',)

admin.site.register(User, CustomUserAdmin)

if UserProfile is not None:
    @admin.register(UserProfile)
    class UserProfileAdmin(admin.ModelAdmin):
        list_display = ('user', 'bio', 'avatar', 'birth_date')
        search_fields = ('user__username', 'user__email')