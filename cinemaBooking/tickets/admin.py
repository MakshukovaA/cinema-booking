from django.contrib import admin
from django.http import HttpResponse
import csv
from .models import Ticket

def export_tickets_csv(_request, queryset):
    header = ['id', 'code', 'booking_id', 'seat_id', 'price', 'issued_at', 'has_qr']
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="tickets.csv"'
    writer = csv.writer(response)
    writer.writerow(header)

    for t in queryset:
        writer.writerow([
            t.id,
            t.code,
            t.booking_id,
            t.seat_id,
            t.price,
            t.issued_at.isoformat() if t.issued_at else '',
            bool(t.qr_code),
        ])

    return response

export_tickets_csv.short_description = "Экспорт билетов в CSV"

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('code', 'booking', 'seat', 'price', 'issued_at')
    search_fields = ('code', 'booking__id', 'seat__id')
    list_filter = ('issued_at', 'booking__status')
    actions = [export_tickets_csv]