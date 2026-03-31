from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SeatViewSet, HallViewSet, HallLayoutView

router = DefaultRouter()
router.register(r'seats', SeatViewSet)
router.register(r'halls', HallViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('halls/<int:pk>/layout/', HallLayoutView.as_view(), name='hall-layout'),
]