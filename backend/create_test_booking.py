import os
import sys
import django
import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cinemaBooking.settings')
sys.path.append('/app')

django.setup()

print('🎬 ======= СОЗДАНИЕ ТЕСТОВОГО БРОНИРОВАНИЯ =======')

try:
    # Импортируем модели
    from apps.users.models import User
    from apps.movies.models import Movie
    from apps.halls.models import Hall
    from apps.seats.models import Seat
    from apps.sessions.models import Session
    from apps.bookings.models import Booking
    from apps.tickets.models import Ticket
    import uuid
    
    # 1. Пользователь
    print('\\n👤 СОЗДАЕМ ПОЛЬЗОВАТЕЛЯ...')
    user, created = User.objects.get_or_create(
        username='cinema_test_user',
        defaults={
            'email': 'test@cinema.com',
            'is_active': True
        }
    )
    if created:
        user.set_password('test123')
        user.save()
        print('✅ Создан пользователь: ' + user.username)
    else:
        print('✅ Используем существующего: ' + user.username)
    
    # 2. Проверяем сеансы
    print('\\n🔍 ПРОВЕРЯЕМ СЕАНСЫ...')
    session = Session.objects.first()
    if not session:
        print('❌ Нет сеансов! Нужно создать через админку.')
        print('   Откройте: http://localhost:8000/admin/sessions/session/add/')
        exit(1)
    
    movie_title = session.movie.title if session.movie else 'Без названия'
    hall_name = session.hall.name if session.hall else 'Нет зала'
    
    print('✅ Найден сеанс: ' + movie_title)
    print('   Зал: ' + hall_name)
    print('   Время: ' + str(session.start_time))
    
    # 3. Проверяем места
    print('\\n💺 ПРОВЕРЯЕМ МЕСТА...')
    if session.hall:
        seats = Seat.objects.filter(hall=session.hall)[:3]
    else:
        seats = Seat.objects.all()[:3]
    
    if not seats:
        print('❌ Нет мест! Создайте места в зале через админку.')
        print('   Откройте: http://localhost:8000/admin/seats/seat/add/')
        exit(1)
    
    print('✅ Найдены места:')
    for seat in seats:
        print('   - Ряд ' + str(seat.row) + ', место ' + str(seat.number))
    
    # 4. СОЗДАЕМ БРОНИРОВАНИЕ
    print('\\n🎫 СОЗДАЕМ БРОНИРОВАНИЕ...')
    
    price_per_ticket = 500.00
    if hasattr(session, 'price'):
        price_per_ticket = session.price
    
    total_price = price_per_ticket * len(seats)
    
    booking = Booking.objects.create(
        user=user,
        session=session,
        status='confirmed',
        total_price=total_price,
        booking_code='TEST-' + uuid.uuid4().hex[:8].upper()
    )
    booking.seats.set(seats)
    
    print('✅ Бронирование создано!')
    print('   ID: ' + str(booking.id))
    print('   Код: ' + booking.booking_code)
    print('   Статус: ' + booking.status)
    print('   Цена: ' + str(booking.total_price) + ' ₽')
    
    # 5. ПРОВЕРЯЕМ АВТОМАТИЧЕСКОЕ СОЗДАНИЕ БИЛЕТОВ
    print('\\n🔍 ПРОВЕРКА АВТОМАТИЧЕСКИХ БИЛЕТОВ...')
    
    import time
    time.sleep(1)
    
    tickets = booking.tickets.all()
    tickets_count = tickets.count()
    print('📊 Билетов создано автоматически: ' + str(tickets_count))
    
    if tickets_count > 0:
        print('🎟️ ДЕТАЛИ БИЛЕТОВ:')
        for i, ticket in enumerate(tickets, 1):
            print('\\n   БИЛЕТ #' + str(i) + ':')
            print('   Код: ' + ticket.code)
            print('   Место: Ряд ' + str(ticket.seat.row) + ', место ' + str(ticket.seat.number))
            
            has_qr = '✅ ЕСТЬ' if ticket.qr_code else '❌ НЕТ'
            print('   QR-код: ' + has_qr)
            
            if not ticket.qr_code:
                print('   Пробуем сгенерировать QR...')
                try:
                    qr_url = ticket.generate_qr_code()
                    if qr_url:
                        print('   ✅ QR сгенерирован')
                    else:
                        print('   ❌ Не удалось сгенерировать QR')
                except Exception as e:
                    print('   ❌ Ошибка: ' + str(e))
    else:
        print('❌ Билеты не созданы автоматически')
        print('🔧 Создаем вручную...')
        
        for seat in seats:
            try:
                ticket = Ticket.objects.create(
                    booking=booking,
                    seat=seat,
                    session=booking.session,
                    price=booking.total_price / len(seats)
                )
                print('   ✅ Создан билет: ' + ticket.code)
                
                # Генерируем QR
                print('   Генерируем QR...')
                try:
                    qr_url = ticket.generate_qr_code()
                    qr_status = '✅ Успешно' if qr_url else '❌ Не удалось'
                    print('   QR: ' + qr_status)
                except Exception as e:
                    print('   ❌ Ошибка QR: ' + str(e))
                    
            except Exception as e:
                print('   ❌ Ошибка создания билета: ' + str(e))
    
    # 6. ИТОГ
    print('\\n📊 ======= ИТОГ =======')
    print('🎫 Всего бронирований: ' + str(Booking.objects.count()))
    print('🎟️ Всего билетов: ' + str(Ticket.objects.count()))
    
    qr_tickets = Ticket.objects.filter(qr_code__isnull=False).count()
    print('📄 Билетов с QR: ' + str(qr_tickets))
    
    print('\\n✅ ТЕСТ УСПЕШНО ЗАВЕРШЕН!')
    print('\\n🔗 Проверьте в админке:')
    print('   http://localhost:8000/admin/tickets/ticket/')
    print('   http://localhost:8000/admin/bookings/booking/')
    
except Exception as e:
    print('❌ КРИТИЧЕСКАЯ ОШИБКА: ' + str(e))
    import traceback
    traceback.print_exc()
