from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    HallListCreateView,
    HallDetailView,
    SeatListCreateView,
    SeatDetailView,
    MovieListCreateView,
    MovieDetailView,
    SessionListCreateView,
    SessionDetailView,
    PricingListCreateView,
    PricingDetailView,
    BookingListCreateView,
    BookingDetailView,
    TicketViewSet,
    UserListCreateView,
    UserDetailView,
)

router = DefaultRouter()
# Пример регистрации (пожалуйста, адаптируй под реальные имена классов в твоих файлах)
# Если у тебя однотипные List/Create и Detail/Update/Delete, можно использовать ViewSets.
# Ниже приведён альтернативный способ через явные классы (без роутера) — можно адаптировать.

urlpatterns = [
    # Пример явной регистрации через include/paths (если ты используешь ListCreateView и т.д.)
    path('halls/', include('apps.halls.urls')),
    path('seats/', include('apps.seats.urls')),
    path('movies/', include('apps.movies.urls')),
    path('sessions/', include('apps.sessions.urls')),
    path('pricing/', include('apps.pricing.urls')),
    path('bookings/', include('apps.bookings.urls')),
    path('tickets/', include('apps.tickets.urls')),
    path('users/', include('apps.users.urls')),
]