# backend/apps/responses/apps.py

from django.apps import AppConfig

class ResponsesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.responses'
    verbose_name = 'Responses'