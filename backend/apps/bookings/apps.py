from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)

class BookingsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.bookings'
    verbose_name = 'Bookings'
    label = 'bookings' 

    def ready(self):
        try:
            import apps.bookings.signals  # noqa: F401
        except Exception as e:
            logger.exception("Error importing bookings signals: %s", e)