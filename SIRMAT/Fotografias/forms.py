from django import forms
from .models import Fotografia

#Creacion del formulario a partir del modelo de Trampas
class FotografiaForm(forms.ModelForm):
    class Meta:
        model = Fotografia #modelo a utilizar
        fields = '__all__'  #Para utilizar campos especificos :  ('nombre','coordenadas',...)