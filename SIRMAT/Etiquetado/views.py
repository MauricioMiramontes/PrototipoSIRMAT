from django.shortcuts import render, redirect
from Etiquetado.models import Etiquetado
from rest_framework import viewsets
from .serializers import EtiquetadoSerializer

# Create your views here.
def etiquetado(request):
    return render(request, 'Etiquetado/etiquetado.html')

class EtiquetadoViewset(viewsets.ModelViewSet):
    queryset = Etiquetado.objects.all() #llamo a todos los productos
    serializer_class = EtiquetadoSerializer #aplico el serializador que convierte los datos a json
