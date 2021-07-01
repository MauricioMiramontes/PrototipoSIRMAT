"""API_SIRMAT URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path

# Importaciones para la documentacion de la API
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Funcion necesaria para documentacion, contiene informacion basica
schema_view = get_schema_view(
   openapi.Info(
      title="API SIRMAT",
      default_version='v1',
      description='''
        Universidad Nacional Autónoma de México
    
        Instituto de Investigaciones en Matemáticas Aplicadas y en Sistemas

        API de sistema SIRMAT

        Encargado del proyecto:

        - Victor Manuel Lomas Barrie

        Desarrollada por:

        - Mauricio Miramontes
        - Eduardo Rivera Delucio
        - Luis Manuel Rosales Gutiérrez
        - Ulises Joshua Portuguez Plata''',
      contact=openapi.Contact(email="victor.lomas@iimas.unam.mx"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    # URLs de la documentacion
    path('docs/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # URLs de la API 
    path('admin/', admin.site.urls),
    path('trampas/', include('Trampas.urls')),
    path('muestras/', include('Muestra.urls')),
    path('detallesmuestra/', include('DetallesMuestra.urls')),
    path('camaras/', include('Camaras.urls')),
    path('fotografias/', include('Fotografias.urls')),
    path('etiquetado/', include('Etiquetado.urls')),
    path('estereoscopios/', include('Estereoscopios.urls')),
    path('usuarios/', include('Usuario.urls')),
    path('especies/', include('Especies.urls')),
    path('', include('Home.urls')),
]
