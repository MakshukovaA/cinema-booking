from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework import permissions


class IsOwnerOrAdmin(BasePermission):
    """
    Разрешение, позволяющее владельцу объекта или администратору получать доступ.
    """

    def has_object_permission(self, request, view, obj):
        # Разрешаем администраторам доступ ко всему
        if request.user.is_staff or request.user.is_superuser:
            return True
        
        # Для бронирования проверяем, является ли пользователь владельцем
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # Для других объектов можно добавить логику
        return False


class IsAuthenticatedOrReadOnly(BasePermission):
    """
    Разрешение, позволяющее аутентифицированным пользователям все действия,
    а неаутентифицированным только чтение.
    """

    def has_permission(self, request, view):
        # Разрешаем безопасные методы (GET, HEAD, OPTIONS) всем
        if request.method in SAFE_METHODS:
            return True
        
        # Разрешаем все действия аутентифицированным пользователям
        return request.user and request.user.is_authenticated


class IsOwner(BasePermission):
    """
    Разрешение, позволяющее доступ только владельцу объекта.
    """

    def has_object_permission(self, request, view, obj):
        # Проверяем, является ли пользователь владельцем объекта
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # Для других типов объектов можно добавить логику
        return False


class IsAdminGroup(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        # Проверяем, есть ли у пользователя группа 'Administrator' или он staff/superuser
        if request.user.groups.filter(name='Administrator').exists():
            return True
        if request.user.is_staff or request.user.is_superuser:
            return True
        return False


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


# Экспортируем все классы
__all__ = [
    'IsAdminGroup',
    'IsGuestReadOnly', 
    'AdminOrGuestReadOnly',
    'IsOwnerOrAdmin',
    'IsAuthenticatedOrReadOnly',
    'IsOwner'
]