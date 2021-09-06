from django.urls import path
from . import views

urlpatterns = [
    path('', views.MuestraAPI.as_view()),
    path('etiquetado_finalizado/', views.EtiquetadoFinalizado.as_view()),  
]