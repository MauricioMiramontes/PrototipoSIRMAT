from django.urls import path
from . import views

urlpatterns = [
    path('', views.FotografiaAPI.as_view())  
]