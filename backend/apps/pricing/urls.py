from django.urls import path
from .views import PricingListCreateView, PricingDetailView

urlpatterns = [
    path('', PricingListCreateView.as_view(), name='pricing-list'),
    path('<int:pk>/', PricingDetailView.as_view(), name='pricing-detail'),
]