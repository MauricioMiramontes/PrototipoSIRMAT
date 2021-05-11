from django.urls import path
from . import views



urlpatterns = [

    path('', views.fotografias, name='Fotografia'),
    path('eliminar-fotografias/<int:id_foto>/',views.eliminarFoto, name='eliminar_foto'),
    

    
]