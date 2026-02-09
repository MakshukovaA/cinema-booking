from django.contrib import admin
from django.http import HttpResponse
import csv
from cinemaBooking.halls.models import Hall

def export_halls_csv(_request, queryset):
    header = ['id', 'name', 'location', 'capacity']
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="halls.csv"'
    writer = csv.writer(response)
    writer.writerow(header)

    for h in queryset:
        writer.writerow([h.id, h.name, h.location, h.capacity])
    return response

export_halls_csv.short_description = "Экспорт Halls в CSV"

@admin.register(Hall)
class HallAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'capacity')
    search_fields = ('name', 'location')
    actions = [export_halls_csv]