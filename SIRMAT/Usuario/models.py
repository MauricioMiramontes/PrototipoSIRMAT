from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

# Create your models here.


class UserManager(BaseUserManager):

    def create_superuser(self, email, first_name, last_name, password=None):
        if not email:
            raise ValueError("User must have an email")
        if not password:
            raise ValueError("User must have a password")
        if not first_name:
            raise ValueError("User must have a first name")
        if not last_name:
            raise ValueError("User must have a last name")

        user = self.model(
            email=self.normalize_email(email)
        )
        user.first_name = first_name
        user.last_name = last_name
        user.set_password(password)
        user.admin = True
        user.staff = True
        user.active = True
        user.save(using=self._db)
        return user


class User(AbstractUser):
    telefono = models.CharField(max_length=10)
    email = models.EmailField(max_length=50, unique=True)
    first_name = models.CharField(max_length=15, blank=False)
    last_name = models.CharField(max_length= 20, blank=False)
    username = models.CharField(max_length=50, blank=True, null=True)
    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ['first_name','last_name']

    objects = UserManager()

    def __str__(self):
        return str(self.id)

# Cuando se crea un nuevo usuario se va a crear automaticamente un token para ese usuario 
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def crear_token_auth(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
