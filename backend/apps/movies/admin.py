from django.contrib import admin
from apps.movies.models import Movie
from django.http import HttpResponse
import csv

def export_movies_csv(modeladmin, request, queryset):
    header = ['id', 'title', 'release_date']
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="movies.csv"'
    writer = csv.writer(response)
    writer.writerow(header)

    for m in queryset:
        writer.writerow([m.id, m.title, m.release_date])
    return response

export_movies_csv.short_description = "Экспорт Movies в CSV"

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'release_date')
    search_fields = ('title',)
    actions = [export_movies_csv]
