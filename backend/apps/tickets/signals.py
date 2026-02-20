from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.tickets.models import Ticket
from apps.bookings.models import Booking
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Booking)
def create_tickets_for_booking(sender, instance, created, **kwargs):
    if created and instance.status == 'confirmed':
        try:
            logger.info(f"🎫 Создание билетов для бронирования {instance.id}")
            if not hasattr(instance, 'session'):
                logger.error(f"❌ У бронирования {instance.id} нет поля session!")
                return
            
            for seat in instance.seats.all():
                ticket = Ticket.objects.create(
                    booking=instance,
                    seat=seat,
                    session=instance.session,
                    price=instance.total_price / instance.seats.count() if instance.seats.count() > 0 else instance.total_price
                )
                logger.info(f"✅ Создан билет {ticket.code}")
                
        except Exception as e:
            logger.error(f"❌ Ошибка создания билетов для бронирования {instance.id}: {e}")

@receiver(post_save, sender=Ticket)
def generate_ticket_qr_code(sender, instance, created, **kwargs):
    """
    Генерирует QR-код для созданного билета
    """
    if created:
        try:
            logger.info(f"🔳 Генерация QR-кода для билета {instance.code}")
            instance.generate_qr_code()
            logger.info(f"✅ QR-код сгенерирован для билета {instance.code}")
        except Exception as e:
            logger.error(f"❌ Ошибка при генерации QR-кода для билета {instance.pk}: {e}")