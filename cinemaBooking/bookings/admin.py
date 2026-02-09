from django.contrib import admin
from django.http import HttpResponse
import csv
from cinemaBooking.bookings.models import Booking, BookingSeat

def export_bookings_csv(_request, queryset):
    header = ['id', 'user_email', 'session_id', 'status', 'created_at', 'total_price', 'tickets_count']
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="bookings.csv"'
    writer = csv.writer(response)
    writer.writerow(header)

    for b in queryset:
        user_email = getattr(b.user, 'email', '')
        session_id = getattr(b.session, 'id', '')
        created_at = getattr(b, 'created_at', '')
        total_price = getattr(b, 'total_price', '')
        tickets_count = b.seats.count()

        writer.writerow([b.id, user_email, session_id, b.status, created_at, total_price, tickets_count])
    return response

export_bookings_csv.short_description = "Экспорт выбранных в CSV"

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'session', 'status', 'created_at', 'total_price')
    search_fields = ('id', 'user__email', 'user__username')
    list_filter = ('status', 'created_at', 'session__movie__title', 'session__hall__name')
    actions = [export_bookings_csv]

@admin.register(BookingSeat)
class BookingSeatAdmin(admin.ModelAdmin):
    list_display = ('id', 'booking', 'seat', 'price')
    search_fields = ('booking__id', 'seat__id')
