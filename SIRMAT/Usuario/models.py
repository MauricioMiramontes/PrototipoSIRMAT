from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
    telefono = models.CharField(max_length=10)
    USERNAME_FIELD = 'id'

    def __str__(self):
        return str(self.id)