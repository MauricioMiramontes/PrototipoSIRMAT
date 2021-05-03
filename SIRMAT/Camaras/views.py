from django.shortcuts import render, redirect
from Camaras.models import Camara
from Camaras.forms import CamaraForm
from django.contrib import messages
# Create your views here.

def camaras(request):
    camaras=Camara.objects.all() #llamar a todos los objetos de mi modelo
    if request.method == 'GET': #si la peticion viene por get
        form= CamaraForm() #llamar al formulario
    else:
        form= CamaraForm(request.POST) #capturamos la informacion del formulario
        if form.is_valid(): #si el formulario es valido
            form.save() #guardar formulario en la base de datos
            messages.success(request, 'Camara añadida correctamente')
            return redirect('Camaras') #redireccionar a la vista trampas.html
            
    return render(request, 'Camaras/camaras.html',{'camaras':camaras, 'form':form}) #contexto 'clave':valor
