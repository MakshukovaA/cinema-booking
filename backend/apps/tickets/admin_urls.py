from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .admin_views import AdminTicketViewSet

router = DefaultRouter()
router.register('admin/tickets', AdminTicketViewSet, basename='admin-tickets')

urlpatterns = [
    path('', include(router.urls)),
]