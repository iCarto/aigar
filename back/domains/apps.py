from django.apps import AppConfig


class DomainsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "domains"

    def ready(self):
        from domains.signals import create_zones  # noqa: F401 WPS433
