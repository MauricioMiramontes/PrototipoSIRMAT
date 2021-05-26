from django.urls import path
from . import views

urlpatterns = [
    path('', views.EtiquetadoAPI.as_view())
]
