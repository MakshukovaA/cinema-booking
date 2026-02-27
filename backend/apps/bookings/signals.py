from django.db.models.signals import post_save
from django.dispatch import receiver
import logging
from apps.bookings.models import Booking
from apps.tickets.models import Ticket

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Booking)
def create_tickets_for_booking(sender, instance, created, **kwargs):
    try:
        if created and getattr(instance, 'status', None) == 'confirmed':
            if not getattr(instance, 'session', None):
                logger.error("Booking %s has no session!", instance.id)
                return

            seats_qs = getattr(instance, 'seats', None)
            seats = seats_qs.all() if seats_qs is not None else []
            if not seats:
                logger.warning("Booking %s has no seats", instance.id)
                return

            price = (instance.total_price / seats.count()) if seats.count() > 0 else instance.total_price

            for seat in seats:
                Ticket.objects.create(
                    booking=instance,
                    seat=seat,
                    session=instance.session,
                    price=price
                )
            logger.info("Created tickets for Booking %s", instance.id)
    except Exception as e:
        logger.exception("Error creating tickets for Booking %s: %s", instance.id, e)