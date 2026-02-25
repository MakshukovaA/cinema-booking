from django.urls import path, include
from rest_framework import routers
from .admin_views import AdminSeatViewSet

router = routers.DefaultRouter()
router.register('admin/seats', AdminSeatViewSet, basename='admin-seats')

urlpatterns = [
    path('', include(router.urls)),
]