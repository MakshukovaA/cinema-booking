from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/halls/', include('cinemaBooking.halls.urls')),
    path('api/seats/', include('cinemaBooking.seats.urls')),
    path('api/movies/', include('cinemaBooking.movies.urls')),
    path('api/pricing/', include('cinemaBooking.pricing.urls')),
    path('api/bookings/', include('cinemaBooking.bookings.urls')),
    path('api/sessions/', include('cinemaBooking.sessions.urls')),
    path('api/tickets/', include('cinemaBooking.tickets.urls')),
    path('api/users/', include('cinemaBooking.users.urls')),
]