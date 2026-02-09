from django.contrib import admin
from django.http import HttpResponse
import csv
from cinemaBooking.sessions.models import Session

def export_sessions_csv(_request, queryset):
    header = ['id', 'movie', 'hall', 'start_time', 'price']
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="sessions.csv"'
    writer = csv.writer(response)
    writer.writerow(header)

    for s in queryset:
        writer.writerow([
            s.id,
            getattr(s.movie, 'title', ''),
            getattr(s.hall, 'name', ''),
            s.start_time,
            s.price,
        ])

    return response

export_sessions_csv.short_description = "Экспорт Sessions в CSV"

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('movie', 'hall', 'start_time', 'price')
    list_filter = ('movie__title', 'hall__name', 'start_time')
    search_fields = ('movie__title', 'hall__name')
    actions = [export_sessions_csv]
