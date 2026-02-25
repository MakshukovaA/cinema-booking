from django.urls import path, include
from rest_framework import routers
from .admin_views import AdminPriceViewSet

router = routers.DefaultRouter()
router.register('admin/prices', AdminPriceViewSet, basename='admin-prices')

urlpatterns = [
    path('', include(router.urls)),
]