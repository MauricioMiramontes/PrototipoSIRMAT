from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register('etiquetado', views.EtiquetadoViewset)

urlpatterns = [

    path('', views.etiquetado, name='Etiquetado'),
    path('api/', include(router.urls)), 


    
]