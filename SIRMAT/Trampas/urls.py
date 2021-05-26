from django.urls import path
from . import views

urlpatterns = [
    path('', views.TrampasAPI.as_view())
]
