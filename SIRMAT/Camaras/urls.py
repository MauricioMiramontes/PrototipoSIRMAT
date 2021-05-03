from django.urls import path
from . import views



urlpatterns = [

    path('', views.camaras, name='Camaras'),
    

    
]