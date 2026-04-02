from django.urls import path
from .views import (
    AdminStatsView,
    MovieStatsView,
    HallStatsView,
    BookingManagementViewSet
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'bookings', BookingManagementViewSet, basename='admin-booking')

urlpatterns = [
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('stats/movies/', MovieStatsView.as_view(), name='admin-movie-stats'),
    path('stats/halls/', HallStatsView.as_view(), name='admin-hall-stats'),
] + router.urls