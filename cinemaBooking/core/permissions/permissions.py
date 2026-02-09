from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminGroup(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.groups.filter(name='Administrator').exists()

class IsGuestReadOnly(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.groups.filter(name='Guest').exists():
            return request.method in SAFE_METHODS
        return False

class AdminOrGuestReadOnly(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.groups.filter(name='Administrator').exists():
            return True
        if request.user.groups.filter(name='Guest').exists():
            return request.method in SAFE_METHODS
        return False

__all__ = ['IsAdminGroup', 'IsGuestReadOnly', 'AdminOrGuestReadOnly']