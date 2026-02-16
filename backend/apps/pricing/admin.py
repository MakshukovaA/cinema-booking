from django.contrib import admin
from apps.pricing.models import Pricing

@admin.register(Pricing)
class PricingAdmin(admin.ModelAdmin):
    list_display = ('name', 'price')
    search_fields = ('name',)