from .models import User
from rest_framework import serializers

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UsuarioTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields =('username','email','first_name')