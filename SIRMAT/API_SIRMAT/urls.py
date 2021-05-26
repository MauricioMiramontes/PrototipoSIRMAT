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
from django.urls import path, include
from rest_framework.authtoken import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('trampas/', include('Trampas.urls')),
    path('muestras/', include('Muestra.urls')),
    path('camaras/', include('Camaras.urls')),
    path('fotografias/', include('Fotografias.urls')),
    path('etiquetado/', include('Etiquetado.urls')),
    path('estereoscopios/', include('Estereoscopios.urls')),
    path('usuarios/', include('Usuario.urls')),
    path('especies/', include('Especies.urls')),
    path('trampas/', include('Trampas.urls')),
    path('', include('Home.urls')),
    path('api_generate_token/', views.obtain_auth_token),



]
