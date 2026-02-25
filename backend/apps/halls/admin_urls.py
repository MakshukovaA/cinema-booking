from django.urls import path, include
from rest_framework import routers
from .admin_views import AdminHallViewSet

router = routers.DefaultRouter()
router.register('admin/halls', AdminHallViewSet, basename='admin-halls')

urlpatterns = [
    path('', include(router.urls)),
]