from django.db import models
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
import qrcode
from io import BytesIO
from django.core import signing
import json

User = get_user_model()

class Ticket(models.Model):
    booking = models.ForeignKey('bookings.Booking', on_delete=models.CASCADE, related_name='tickets')
    seat = models.ForeignKey('seats.Seat', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    code = models.CharField(max_length=20, unique=True)
    issued_at = models.DateTimeField(auto_now_add=True)
    qr_code = models.ImageField(upload_to='tickets/qr/', null=True, blank=True)

    def __str__(self):
        return f'Ticket {self.code} for {self.booking}'

    def generate_qr_code(self, use_signed=True, extra_payload=None):
        payload = {
            'ticket_id': self.pk,
            'issued_at': self.issued_at.isoformat(),
            'booking_id': self.booking.pk,
        }

        session_id = getattr(self.booking, 'session_id', None)
        if session_id:
            payload['session_id'] = session_id

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
        filename = f"ticket_{self.pk}.png"

        self.qr_code.save(filename, ContentFile(buffer.getvalue()), save=True)

        return self.qr_code.url