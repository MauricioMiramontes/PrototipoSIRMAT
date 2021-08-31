from django.urls import path
from . import views
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('', views.UsuariosAPI.as_view()),
    path('signup/', views.UsuariosSingUp.as_view(), name='singup' ),
    path('login/', views.CustomAuthToken.as_view(), name='login'),
    path('logout/', views.Logout.as_view(), name='logout'),
    path('signup_admin/', views.UsuariosSignUpAdmin.as_view() , name='signup_admin'),
    path('signup_staff/', views.UsuariosSignUpStaff.as_view() , name='signup_staff'),
    path('delete_user/', views.DeleteUser.as_view() , name='delete_user'),
]