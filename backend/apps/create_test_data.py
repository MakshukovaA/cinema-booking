import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cinemaBooking.settings')
sys.path.append('/app')

django.setup()

from apps.users.models import User
from apps.sessions.models import Session
from apps.seats.models import Seat
from apps.bookings.models import Booking
from apps.tickets.models import Ticket
import uuid

print("🎬 ========== ТЕСТ СОЗДАНИЯ БИЛЕТОВ С QR-КОДАМИ ==========")

try:
    user, created = User.objects.get_or_create(
        username='qr_test_user',
        defaults={
            'email': 'qr_test@example.com',
            'is_active': True
        }
    )
    if created:
        user.set_password('testpass123')
        user.save()
        print(f"✅ Создан пользователь: {user.username}")
    else:
        print(f"✅ Используем существующего пользователя: {user.username}")
  
    session = Session.objects.filter(movie__isnull=False).first()
    if not session:
        print("❌ Нет сеансов с фильмами!")
        print("   Создайте сеанс через админку: http://localhost:8000/admin/sessions/session/")
        sys.exit(1)
    
    print(f"✅ Сеанс: '{session.movie.title}' в '{session.hall.name}'")
    print(f"   Время: {session.start_time}")
  
    seats = Seat.objects.filter(hall=session.hall)[:3]
    if not seats:
        print(f"❌ В зале '{session.hall.name}' нет мест!")
        sys.exit(1)
    
    print(f"✅ Выбраны места:")
    for seat in seats:
        print(f"   - Ряд {seat.row}, место {seat.number}")
    
    print("\\n🎫 СОЗДАЕМ БРОНИРОВАНИЕ...")
    
    booking = Booking.objects.create(
        user=user,
        session=session,
        status='confirmed',
        total_price=450.00,
        booking_code=f'QR-TEST-{uuid.uuid4().hex[:8].upper()}'
    )
    booking.seats.set(seats)
    
    print(f"✅ Бронирование создано!")
    print(f"   ID: {booking.id}")
    print(f"   Код: {booking.booking_code}")
    print(f"   Статус: {booking.status}")
    print(f"   Цена: {booking.total_price} ₽")
    print("\\n🔍 ПРОВЕРКА БИЛЕТОВ (автоматически через сигналы)...")
   
    import time
    time.sleep(2)
    
    tickets = booking.tickets.all()
    if tickets:
        print(f"✅ Сигналы сработали! Создано {tickets.count()} билетов:")
        
        for i, ticket in enumerate(tickets, 1):
            print(f"\\n   🎟️ БИЛЕТ #{i}:")
            print(f"   Код билета: {ticket.code}")
            print(f"   Место: Ряд {ticket.seat.row}, место {ticket.seat.number}")
            print(f"   Цена: {ticket.price} ₽")
            print(f"   Сеанс: {ticket.session.movie.title if ticket.session else 'Нет'}")
            print(f"   QR-код: {'✅ СГЕНЕРИРОВАН' if ticket.qr_code else '❌ ОТСУТСТВУЕТ'}")
            
            if ticket.qr_code:
                print(f"   URL QR: {ticket.qr_code.url}")
                print(f"   Путь: {ticket.qr_code.path}")
    else:
        print("❌ Билеты не созданы автоматически")
        print("   Создаем билеты вручную...")
        
        for seat in seats:
            ticket = Ticket.objects.create(
                booking=booking,
                seat=seat,
                session=booking.session,
                price=booking.total_price / len(seats)
            )
            print(f"✅ Создан билет: {ticket.code}")
            print("\\n" + "="*50)
            print("✨ ТЕСТ ЗАВЕРШЕН!")
            print(f"📊 Всего билетов для бронирования #{booking.id}: {booking.tickets.count()}")
            print("\\n📁 Проверьте в админке:")
            print("   http://localhost:8000/admin/tickets/ticket/")
            print("   http://localhost:8000/admin/bookings/booking/")
    
except Exception as e:
    print(f"❌ КРИТИЧЕСКАЯ ОШИБКА: {e}")
    import traceback
    traceback.print_exc()