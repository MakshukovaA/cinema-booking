from django.contrib import admin
from django.http import HttpResponse
import csv
from apps.halls.models import Seat

def export_seats_csv(_request, queryset):
    header = ['id', 'hall', 'row', 'number', 'seat_type', 'is_available', 'is_vip']
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="seats.csv"'
    writer = csv.writer(response)
    writer.writerow(header)

    for s in queryset:
        writer.writerow([
            s.id,
            getattr(s.hall, 'name', ''),
            s.row,
            s.number,
            s.seat_type,
            s.is_available,
            s.is_vip,
        ])
    return response

export_seats_csv.short_description = "Экспорт Seats в CSV"

@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ('hall', 'row', 'number', 'seat_type', 'is_available', 'is_vip')
    list_filter = ('hall__name', 'seat_type', 'is_available', 'is_vip')
    search_fields = ('hall__name', 'row', 'number')
    actions = [export_seats_csv]