from django.urls import path, include
from rest_framework import routers
from .admin_views import AdminBookingViewSet

router = routers.DefaultRouter()
router.register('admin/bookings', AdminBookingViewSet, basename='admin-bookings')

urlpatterns = [
    path('', include(router.urls)),
]