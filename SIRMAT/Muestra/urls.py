from django.urls import path
from . import views

urlpatterns = [
    path('', views.MuestraAPI.as_view())  
]