from django.urls import path
from . import views

urlpatterns = [
    path('', views.CamarasAPI.as_view())
]
