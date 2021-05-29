from .models import Fotografia
from rest_framework import serializers

class FotografiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fotografia
        fields = '__all__'