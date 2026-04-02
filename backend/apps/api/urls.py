from django.urls import include, path
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def api_root(request):
    return Response({
        'halls': '/api/halls/',
        'seats': '/api/seats/',
        'movies': '/api/movies/',
        'sessions': '/api/sessions/',
        'pricing': '/api/pricing/',
        'bookings': '/api/bookings/',
        'tickets': '/api/tickets/',
        'users': '/api/users/',
        'admin': '/api/admin/',
        'token': '/api/token/',
        'token_refresh': '/api/token/refresh/',
    })


urlpatterns = [
    path('', api_root, name='api-root'),
    path('halls/', include('apps.halls.urls')),
    path('seats/', include('apps.seats.urls')),
    path('movies/', include('apps.movies.urls')),
    path('sessions/', include('apps.sessions.urls')),
    path('pricing/', include('apps.pricing.urls')),
    path('bookings/', include('apps.bookings.urls')),
    path('tickets/', include('apps.tickets.urls')),
    path('users/', include('apps.users.urls')),
]