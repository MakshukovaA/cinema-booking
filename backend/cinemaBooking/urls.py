# cinemaBooking/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/halls/', include('apps.halls.urls')),
    path('api/seats/', include('apps.seats.urls')),
    path('api/movies/', include('apps.movies.urls')),
    path('api/pricing/', include('apps.pricing.urls')),
    path('api/bookings/', include('apps.bookings.urls')),
    path('api/sessions/', include('apps.sessions.urls')),
    path('api/tickets/', include('apps.tickets.urls')), 
    path('api/users/', include('apps.users.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/admin/', include('apps.api.urls', namespace='api_admin')),
]