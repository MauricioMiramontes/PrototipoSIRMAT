from django.urls import path
from . import views



urlpatterns = [

    path('', views.trampas, name='Trampa'),
    path('eliminar/<int:id_trampas>/',views.eliminarTrampa, name='eliminar_trampa'),
    path('editar/<int:id_trampas>/',views.editarTrampa, name='editar_trampa'),

    
]
