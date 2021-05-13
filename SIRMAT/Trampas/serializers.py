from .models import Trampas
from rest_framework import serializers

class TrampaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trampas
        fields = '__all__'