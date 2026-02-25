from django.urls import path, include
from rest_framework import routers
from .admin_views import AdminSessionViewSet

router = routers.DefaultRouter()
router.register('admin/sessions', AdminSessionViewSet, basename='admin-sessions')

urlpatterns = [
    path('', include(router.urls)),
]