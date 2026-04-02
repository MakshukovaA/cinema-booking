from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from django.urls import NoReverseMatch


def safe_reverse(name, request, format):
    try:
        return reverse(name, request=request, format=format)
    except NoReverseMatch:
        return None


@api_view(['GET'])
def api_root(request, format=None):
    api_links = {
        'halls': safe_reverse('hall-list', request, format),
        'seats': safe_reverse('seat-list', request, format),
        'movies': safe_reverse('movie-list', request, format),
        'sessions': safe_reverse('session-list', request, format),
        'pricing': safe_reverse('pricing-list', request, format),
        'bookings': safe_reverse('booking-list', request, format),
        'tickets': safe_reverse('ticket-list', request, format),
        'users': safe_reverse('user-list', request, format),
        'token_obtain_pair': safe_reverse('token_obtain_pair', request, format),
        'token_refresh': safe_reverse('token_refresh', request, format),
    }
    return Response({k: v for k, v in api_links.items() if v is not None})