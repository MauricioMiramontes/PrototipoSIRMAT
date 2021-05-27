from django.urls import path
from . import views

urlpatterns = [
    path('', views.DetallesMuestraAPI.as_view())
]
