from django.urls import path, include
from . import views
from rest_framework import routers

#router genera las urls necesarias para listar,modificar,agregar y eliminar
router = routers.DefaultRouter()
router.register('trampa', views.TrampaViewset) 



urlpatterns = [

    path('', views.trampas, name='Trampa'),
    path('eliminar-trampas/<int:id_trampas>/',views.eliminarTrampa, name='eliminar_trampa'),
    path('editar-trampas/<int:id_trampas>/',views.editarTrampa, name='editar_trampa'),
    path('api/', include(router.urls)), #las urls de router son pasadas a este path

    
]
