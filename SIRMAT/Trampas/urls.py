from django.urls import path
from . import views



urlpatterns = [

    path('', views.trampas, name='Trampa'),
    path('eliminar-trampas/<int:id_trampas>/',views.eliminarTrampa, name='eliminar_trampa'),
    path('editar-trampas/<int:id_trampas>/',views.editarTrampa, name='editar_trampa'),

    
]
