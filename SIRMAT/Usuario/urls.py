from django.urls import path
from . import views

urlpatterns = [
    path('', views.UsuariosAPI.as_view())
]