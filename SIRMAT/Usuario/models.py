from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
    telefono = models.CharField(max_length=10)
    email = models.EmailField(max_length=50, unique=True)
    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ()

    def __str__(self):
        return str(self.id)