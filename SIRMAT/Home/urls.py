from django.urls import re_path
from Home import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
   re_path('',views.home, name='Home')
]
