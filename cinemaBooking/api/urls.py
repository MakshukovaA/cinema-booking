from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminStatsView,
    MovieStatsView,
    HallStatsView,
    BookingManagementViewSet
)

app_name = 'api_admin'

router = DefaultRouter()
router.register(r'bookings', BookingManagementViewSet, basename='admin-booking')

urlpatterns = [
    path('stats/general/', AdminStatsView.as_view(), name='admin-general-stats'),
    path('stats/movies/', MovieStatsView.as_view(), name='admin-movie-stats'),
    path('stats/halls/', HallStatsView.as_view(), name='admin-hall-stats'),
    path('', include(router.urls)),
]