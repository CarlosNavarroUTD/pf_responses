# myproject/urls.py 
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/usuarios/', include('apps.usuarios.urls')),  # Conectamos las URLs de la API de usuarios
    path('api/respuestas/', include('apps.responses.urls')),  # Conectamos las URLs de la API de respuestas
    re_path(r'^.*', TemplateView.as_view(template_name='index.html')),
]