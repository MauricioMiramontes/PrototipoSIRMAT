from django.urls import path
from . import views

urlpatterns = [
    path('', views.UsuariosAPI.as_view()) , 
    path('login/', views.Login.as_view()) , 
    path('logout/', views.Logout.as_view()) , 
    path('refresh-token/', views.UserToken.as_view()) , 

]