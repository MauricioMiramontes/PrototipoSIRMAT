from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

# Create your models here.


class User(AbstractUser):
    telefono = models.CharField(max_length=10)
    email = models.EmailField(max_length=50, unique=True)
    first_name = models.CharField(max_length=15, blank=False)
    last_name = models.CharField(max_length= 20, blank=False)
    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ['first_name','last_name']

    def __str__(self):
        return str(self.id)

# Cuando se crea un nuevo usuario se va a crear automaticamente un token para ese usuario 
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def crear_token_auth(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
