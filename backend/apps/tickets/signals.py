from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.tickets.models import Ticket

@receiver(post_save, sender=Ticket)
def generate_ticket_qr_code(sender, instance, created, **kwargs):
    if created:
        try:
            instance.generate_qr_code()
        except Exception as e:
            print(f"Ошибка при генерации QR-кода для билета {instance.pk}: {e}")