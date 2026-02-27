import os
import sys
import django
import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cinemaBooking.settings')
sys.path.append('/app')

django.setup()

print('🎬 ======= СОЗДАНИЕ ПОЛНОГО ЦИКЛА ДАННЫХ ДЛЯ КИНОТЕАТРА =======')

try:
    from apps.users.models import User
    from apps.movies.models import Movie
    from apps.halls.models import Hall
    from apps.seats.models import Seat
    from apps.sessions.models import Session as CinemaSession
    from apps.bookings.models import Booking
    from apps.tickets.models import Ticket
    import uuid
    
    print('✅ Модель сеансов доступна')
    
    print('\\n📋 ПРОВЕРКА СУЩЕСТВУЮЩИХ ДАННЫХ:')
    print('Пользователей:', User.objects.count())
    print('Фильмов:', Movie.objects.count())
    print('Залов:', Hall.objects.count())
    print('Мест:', Seat.objects.count())
    print('Сеансов:', CinemaSession.objects.count())
    print('Бронирований:', Booking.objects.count())
    print('Билетов:', Ticket.objects.count())
    
    print('\\n🔧 СОЗДАЕМ НЕДОСТАЮЩИЕ ДАННЫЕ...')
    print('\\n👤 1. СОЗДАЕМ ПОЛЬЗОВАТЕЛЯ...')
    user, user_created = User.objects.get_or_create(
        username='cinema_user',
        defaults={
            'email': 'user@cinema.com',
            'is_active': True,
            'is_staff': False
        }
    )
    if user_created:
        user.set_password('cinema123')
        user.save()
        print('✅ Создан новый пользователь:', user.username)
    else:
        print('✅ Используем существующего пользователя:', user.username)

    print('\\n🎬 2. СОЗДАЕМ ФИЛЬМ...')
    movie, movie_created = Movie.objects.get_or_create(
        title='Интерстеллар',
        defaults={
            'description': 'Эпическая научно-фантастическая драма о космических путешествиях',
            'duration': 169,  
            'genre': 'SF',  
            'release_date': '2014-10-26',
            'rating': 8.6
        }
    )
    if movie_created:
        print('✅ Создан фильм:', movie.title)
        print('   Длительность:', movie.duration, 'минут')
        print('   Жанр:', movie.get_genre_display())
        print('   Рейтинг:', movie.rating)
    else:
        print('✅ Используем существующий фильм:', movie.title)
 
    print('\\n🏢 3. СОЗДАЕМ ЗАЛ...')
    hall, hall_created = Hall.objects.get_or_create(
        name='Красный зал',
        defaults={
            'location': 'Основной корпус, 2 этаж',
            'rows': 5,
            'cols': 10,
            'capacity': 50
        }
    )
    if hall_created:
        print('✅ Создан зал:', hall.name)
        print('   Расположение:', hall.location)
        print('   Ряды/Места:', hall.rows, 'x', hall.cols)
        print('   Вместимость:', hall.capacity, 'мест')
    else:
        print('✅ Используем существующий зал:', hall.name)
    
    print('\\n💺 4. СОЗДАЕМ МЕСТА В ЗАЛЕ...')
    existing_seats = Seat.objects.filter(hall=hall).count()
    
    if existing_seats == 0:
        seats_to_create = []
        print('   Создаем 5 рядов по 10 мест...')
        
        for row in range(1, hall.rows + 1):
            for number in range(1, hall.cols + 1): 
                seat = Seat(
                    hall=hall,
                    row=row,
                    number=number,
                    seat_type='VIP' if row == 1 else 'NORMAL',
                    is_vip=(row == 1),
                    is_available=True
                )
                seats_to_create.append(seat)
        Seat.objects.bulk_create(seats_to_create)
        print('✅ Создано', len(seats_to_create), 'мест в зале')
    else:
        print('✅ В зале уже есть', existing_seats, 'мест')
    seats_for_booking = list(Seat.objects.filter(hall=hall)[:3])
    print('\\n🕒 5. СОЗДАЕМ СЕАНС...')
    tomorrow = datetime.datetime.now() + datetime.timedelta(days=1)
    start_time = tomorrow.replace(hour=18, minute=0, second=0, microsecond=0)
    session, session_created = CinemaSession.objects.get_or_create(
        movie=movie,
        hall=hall,
        start_time=start_time,
        defaults={
            'price': 600.00 
        }
    )
    
    if session_created:
        print('✅ Создан сеанс!')
        print('   Фильм:', session.movie.title)
        print('   Зал:', session.hall.name)
        print('   Начало:', session.start_time.strftime('%d.%m.%Y %H:%M'))
        print('   Цена билета:', session.price, '₽')
    else:
        print('✅ Используем существующий сеанс')
    print('\\n🎫 6. СОЗДАЕМ БРОНИРОВАНИЕ...')
    total_price = session.price * len(seats_for_booking)
    booking_code = 'CINEMA-' + uuid.uuid4().hex[:8].upper()
    
    booking = Booking.objects.create(
        user=user,
        session=session,
        total_price=total_price,
        status='confirmed',
        booking_code=booking_code
    )
    
    if hasattr(booking, 'seats'):
        booking.seats.set(seats_for_booking)
        print('✅ Места привязаны к бронированию')
    
    print('✅ Бронирование создано!')
    print('   Код бронирования:', booking.booking_code)
    print('   Статус:', booking.status)
    print('   Общая цена:', booking.total_price, '₽')
    print('   Места:', [f'Ряд {s.row}, место {s.number}' for s in seats_for_booking])
    print('\\n🎟️ 7. СОЗДАЕМ БИЛЕТЫ...')
    
    for i, seat in enumerate(seats_for_booking, 1):
        try:
            ticket_data = {
                'booking': booking,
                'seat': seat,
                'session': session, 
                'price': session.price, 
                'code': f'TICKET-{uuid.uuid4().hex[:6].upper()}',
            }
            
            ticket = Ticket.objects.create(**ticket_data)
            print(f'   ✅ Создан билет {i}:', ticket.code)
            print(f'      Место: Ряд {seat.row}, место {seat.number}')
            print(f'      Цена: {ticket.price} ₽')
            if hasattr(ticket, 'generate_qr_code'):
                try:
                    print('      Генерируем QR-код...')
                    qr_url = ticket.generate_qr_code()
                    if qr_url:
                        print('      ✅ QR-код создан')
                    else:
                        print('      ⚠️ Не удалось создать QR-код')
                except Exception as e:
                    print(f'      ⚠️ Ошибка QR: {str(e)}')
            
        except Exception as e:
            print(f'   ❌ Ошибка создания билета {i}:', str(e))

    print('\\n📊 ======= ИТОГОВАЯ СТАТИСТИКА =======')
    print('👤 Пользователей:', User.objects.count())
    print('🎬 Фильмов:', Movie.objects.count())
    print('🏢 Залов:', Hall.objects.count())
    print('💺 Мест:', Seat.objects.count())
    print('🕒 Сеансов:', CinemaSession.objects.count())
    print('🎫 Бронирований:', Booking.objects.count())
    print('🎟️ Билетов:', Ticket.objects.count())
    
    qr_tickets = Ticket.objects.filter(qr_code__isnull=False).count()
    print('📄 Билетов с QR-кодами:', qr_tickets)
    
    print('\\n✅ ВСЕ ДАННЫЕ УСПЕШНО СОЗДАНЫ!')
    print('\\n🔗 АДМИНКА ДЛЯ ПРОВЕРКИ:')
    print('   Пользователи: http://localhost:8000/admin/users/user/')
    print('   Фильмы: http://localhost:8000/admin/movies/movie/')
    print('   Залы: http://localhost:8000/admin/halls/hall/')
    print('   Места: http://localhost:8000/admin/seats/seat/')
    print('   Бронирования: http://localhost:8000/admin/bookings/booking/')
    print('   Билеты: http://localhost:8000/admin/tickets/ticket/')
    print('   Сеансы: http://localhost:8000/admin/sessions/session/')
    
    print('\\n🎯 ТЕСТОВЫЕ ДАННЫЕ:')
    print('   Код бронирования:', booking.booking_code)
    print('   Пользователь:', user.username, '(пароль: cinema123)')
    print('   Фильм:', movie.title)
    print('   Время сеанса:', session.start_time.strftime('%d.%m.%Y %H:%M'))
    
except Exception as e:
    print('❌ КРИТИЧЕСКАЯ ОШИБКА:', str(e))
    import traceback
    traceback.print_exc()
