from .models import Muestra
from rest_framework import serializers

class MuestraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Muestra
        fields = '__all__'