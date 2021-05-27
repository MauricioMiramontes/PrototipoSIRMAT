from .models import Camara
from rest_framework import serializers


class CamaraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Camara
        fields = '__all__'
