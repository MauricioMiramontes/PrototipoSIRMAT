from django.urls import path
from . import views

urlpatterns = [
    path('', views.EspeciesAPI.as_view())
]
