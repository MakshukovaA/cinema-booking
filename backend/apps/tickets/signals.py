from django.db.models.signals import post_save
from django.dispatch import receiver
import logging

from apps.tickets.models import Ticket

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Ticket)
def generate_ticket_qr_code(sender, instance, created, **kwargs):
    if created and not instance.qr_code:
        try:
            logger.info("Generating QR code for Ticket %s", instance.code)
            instance.generate_qr_code()
            logger.info("QR code generated for Ticket %s", instance.code)
        except Exception as e:
            logger.exception("Error generating QR for Ticket %s: %s", instance.id, e)