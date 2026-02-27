from django.db import models
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
import qrcode
from io import BytesIO
from django.core import signing
import json
import uuid

User = get_user_model()

class Ticket(models.Model):
    booking = models.ForeignKey('bookings.Booking', on_delete=models.CASCADE, related_name='tickets')
    seat = models.ForeignKey('seats.Seat', on_delete=models.CASCADE)
    session = models.ForeignKey('sessions.Session', on_delete=models.CASCADE, related_name='tickets', null=True, blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    code = models.CharField(max_length=20, unique=True, blank=True)
    issued_at = models.DateTimeField(auto_now_add=True)
    qr_code = models.ImageField(upload_to='tickets/qr/', null=True, blank=True)

    class Meta:
        ordering = ['-issued_at']
        verbose_name = 'Билет'
        verbose_name_plural = 'Билеты'

    def __str__(self):
        return f'Ticket {self.code} for {self.booking}'
    
    def save(self, *args, **kwargs):
        if not self.code:
            self.code = f"TKT-{uuid.uuid4().hex[:8].upper()}"
        if not self.session_id and self.booking and hasattr(self.booking, 'session'):
            self.session = self.booking.session
        
        super().save(*args, **kwargs)
  
    def generate_qr_code(self, use_signed=True, extra_payload=None):
        try:
            session_info = {}
            if self.session:
                movie_title = None
                session_time = None
                hall_name = None
                
                if hasattr(self.session, 'movie'):
                    movie_title = self.session.movie.title
                if hasattr(self.session, 'start_time'):
                    session_time = self.session.start_time.isoformat()
                if hasattr(self.session, 'hall') and hasattr(self.session.hall, 'name'):
                    hall_name = self.session.hall.name
                
                session_info = {
                    'session_id': str(self.session.pk),
                    'movie_title': movie_title,
                    'session_time': session_time,
                    'hall_name': hall_name,
                }
                
            seat_row = None
            seat_number = None
            if self.seat:
                if hasattr(self.seat, 'row'):
                    seat_row = self.seat.row
                if hasattr(self.seat, 'number'):
                    seat_number = self.seat.number
            
            payload = {
                'ticket_id': str(self.pk),
                'ticket_code': self.code,
                'issued_at': self.issued_at.isoformat(),
                'booking_id': str(self.booking.pk),
                'seat_row': seat_row,
                'seat_number': seat_number,
                'price': str(self.price),
                **session_info
            }

            if extra_payload:
                payload.update(extra_payload)

            data_str = signing.dumps(payload) if use_signed else json.dumps(payload)

            qr = qrcode.QRCode(
                version=None,
                error_correction=qrcode.constants.ERROR_CORRECT_Q,
                box_size=10,
                border=4,
            )
            qr.add_data(data_str)
            qr.make(fit=True)

            img = qr.make_image(fill_color="black", back_color="white").convert('RGB')

            buffer = BytesIO()
            img.save(buffer, format='PNG')
            filename = f"ticket_{self.code}.png"

            self.qr_code.save(filename, ContentFile(buffer.getvalue()), save=False)
            super().save(update_fields=['qr_code'])
            
            return self.qr_code.url
            
        except Exception as e:
            print(f"❌ Ошибка генерации QR-кода для билета {self.code}: {e}")
            import traceback
            traceback.print_exc()
            return None

    @property
    def qr_code_url(self):
        if self.qr_code:
            return self.qr_code.url
        return None