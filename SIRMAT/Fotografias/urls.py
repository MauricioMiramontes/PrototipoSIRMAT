from django.urls import path
from . import views

urlpatterns = [
    path('', views.FotografiaAPI.as_view()),
    path('revision_finalizada/', views.RevisionFinalizada.as_view()),
    path('etiquetado_finalizado/', views.EtiquetadoFinalizado.as_view()),
    path('etiquetado_rechazado/',views.EtiquetadoRechazado.as_view()) 
]