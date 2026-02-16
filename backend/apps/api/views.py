from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count, Sum, Avg, Q
from django.db.models.functions import TruncDate, ExtractHour, ExtractWeekDay
from datetime import datetime, timedelta
from backend.apps.bookings.models import Booking
from backend.apps.movies.models import Movie
from backend.apps.halls.models import Hall
from .permissions import IsAdminUser


class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        days = int(request.query_params.get('days', 30))
        start_date = datetime.now() - timedelta(days=days)

        bookings = Booking.objects.filter(created_at__gte=start_date)

        total_bookings = bookings.count()
        total_revenue = bookings.aggregate(total=Sum('total_price'))['total'] or 0
        avg_booking_value = bookings.aggregate(avg=Avg('total_price'))['avg'] or 0

        bookings_by_status = dict(
            bookings.values('status').annotate(count=Count('id')).values_list('status', 'count')
        )

        bookings_by_day = []
        daily_stats = bookings.annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            count=Count('id'),
            revenue=Sum('total_price')
        ).order_by('date')

        for stat in daily_stats:
            bookings_by_day.append({
                'date': stat['date'].strftime('%Y-%m-%d'),
                'count': stat['count'],
                'revenue': float(stat['revenue'])
            })

        data = {
            'period': f'Последние {days} дней',
            'total_bookings': total_bookings,
            'total_revenue': float(total_revenue),
            'average_booking_value': float(avg_booking_value),
            'bookings_by_status': bookings_by_status,
            'bookings_by_day': bookings_by_day
        }

        return Response(data)


class MovieStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        days = int(request.query_params.get('days', 30))
        start_date = datetime.now() - timedelta(days=days)

        movie_stats = []

        movies = Movie.objects.annotate(
            session_count=Count('sessions'),
            booking_count=Count('sessions__bookings', filter=Q(sessions__bookings__created_at__gte=start_date)),
            revenue=Sum('sessions__bookings__total_price', filter=Q(sessions__bookings__created_at__gte=start_date))
        ).filter(session_count__gt=0)

        for movie in movies:
            total_capacity = 0
            total_seats_sold = 0

            for session in movie.sessions.all():
                hall_capacity = session.hall.capacity
                seats_sold = session.bookings.aggregate(seats=Count('booking_seats'))['seats'] or 0
                total_capacity += hall_capacity
                total_seats_sold += seats_sold

            avg_occupancy = (total_seats_sold / total_capacity * 100) if total_capacity > 0 else 0

            movie_stats.append({
                'movie_id': movie.id,
                'movie_title': movie.title,
                'total_sessions': movie.session_count,
                'total_bookings': movie.booking_count or 0,
                'total_revenue': float(movie.revenue or 0),
                'average_occupancy': round(avg_occupancy, 2)
            })

        movie_stats.sort(key=lambda x: x['total_revenue'], reverse=True)

        return Response(movie_stats)


class HallStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        days = int(request.query_params.get('days', 30))
        start_date = datetime.now() - timedelta(days=days)

        hall_stats = []

        halls = Hall.objects.annotate(
            session_count=Count('sessions', filter=Q(sessions__start_time__gte=start_date)),
            booking_count=Count('sessions__bookings', filter=Q(sessions__bookings__created_at__gte=start_date)),
            revenue=Sum('sessions__bookings__total_price', filter=Q(sessions__bookings__created_at__gte=start_date))
        )

        for hall in halls:
            total_capacity = hall.capacity * hall.session_count if hall.session_count > 0 else 0
            utilization_rate = (hall.booking_count / total_capacity * 100) if total_capacity > 0 else 0

            hall_stats.append({
                'hall_id': hall.id,
                'hall_name': hall.name,
                'total_sessions': hall.session_count,
                'total_bookings': hall.booking_count or 0,
                'total_revenue': float(hall.revenue or 0),
                'utilization_rate': round(utilization_rate, 2)
            })

        return Response(hall_stats)


class BookingManagementViewSet(viewsets.ModelViewSet):
    from backend.apps.bookings.serializers import BookingSerializer

    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Используем другое имя переменной, чтобы не затенять импорт
        booking_status = self.request.query_params.get('status')
        if booking_status:
            queryset = queryset.filter(status=booking_status)

        movie_id = self.request.query_params.get('movie_id')
        if movie_id:
            queryset = queryset.filter(session__movie_id=movie_id)

        hall_id = self.request.query_params.get('hall_id')
        if hall_id:
            queryset = queryset.filter(session__hall_id=hall_id)

        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)

        return queryset

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        days = int(request.query_params.get('days', 30))
        start_date = datetime.now() - timedelta(days=days)

        bookings = Booking.objects.filter(created_at__gte=start_date)

        hourly_stats = bookings.annotate(
            hour=ExtractHour('created_at')
        ).values('hour').annotate(
            count=Count('id')
        ).order_by('hour')

        weekday_stats = bookings.annotate(
            weekday=ExtractWeekDay('created_at')
        ).values('weekday').annotate(
            count=Count('id')
        ).order_by('weekday')

        return Response({
            'hourly_distribution': list(hourly_stats),
            'weekday_distribution': list(weekday_stats)
        })