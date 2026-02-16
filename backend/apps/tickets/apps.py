from django.apps import AppConfig

class TicketsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.tickets'

    def ready(self):
        # noqa: D401 - импорт для регистрации сигналов
        import apps.tickets.signals  # noqa: F401