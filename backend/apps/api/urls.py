from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.movies.views import MovieViewSet
from apps.seats.views import SeatViewSet
from apps.seats.views import HallLayoutView
from apps.sessions.views import SessionViewSet, AvailableSeatsView
from apps.tickets.views import TicketViewSet
from apps.bookings.views import BookingViewSet, BookingSeatViewSet, UserBookingsView
from apps.pricing.views import PricingListCreateView, PricingDetailView
from apps.users.views import UserViewSet
from apps.halls.views import HallListCreateView, HallDetailView

router = DefaultRouter()
router.register(r'movies', MovieViewSet, basename='movie')
router.register(r'sessions', SessionViewSet, basename='session')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'booking-seats', BookingSeatViewSet, basename='bookingseat')
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),

    path('halls/', HallListCreateView.as_view(), name='hall-list'),
    path('halls/<int:pk>/', HallDetailView.as_view(), name='hall-detail'),
    path('halls/<int:pk>/layout/', HallLayoutView.as_view(), name='hall-layout'),

    path('sessions/<int:pk>/available-seats/', AvailableSeatsView.as_view(), name='session-available-seats'),

    path('pricing/', PricingListCreateView.as_view(), name='pricing-list'),
    path('pricing/<int:pk>/', PricingDetailView.as_view(), name='pricing-detail'),

    path('user-bookings/', UserBookingsView.as_view(), name='user-bookings'),
]