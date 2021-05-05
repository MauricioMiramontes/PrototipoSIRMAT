from django.urls import path
from . import views



urlpatterns = [

    path('', views.camaras, name='Camaras'),
    path('eliminar-camaras/<int:id_camaras>/',views.eliminarCamara, name='eliminar_camara'),
    path('editar-camaras/<int:id_camaras>/',views.editarCamara, name='editar_camara'),
    

    
]