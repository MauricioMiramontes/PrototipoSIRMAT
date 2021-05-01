from django.shortcuts import render, redirect
from Trampas.models import Trampas
from Trampas.forms import TrampaForm #importar el formulario basado en modelo
from django.contrib import messages
# Create your views here.


def trampas(request):
    trampas=Trampas.objects.all() #llamar a todos los objetos de mi modelo
    if request.method == 'GET': #si la peticion viene por get
        form= TrampaForm() #llamar al formulario
    else:
        form= TrampaForm(request.POST) #capturamos la informacion del formulario
        if form.is_valid(): #si el formulario es valido
            form.save() #guardar formulario en la base de datos
            messages.success(request, 'Trampa añadida correctamente')
            return redirect('Trampa') #redireccionar a la vista trampas.html
            
    return render(request, 'Trampas/trampas.html',{'trampas':trampas,'form':form}) #contexto 'clave':valor

def editarTrampa(request,id_trampas):
    trampa = Trampas.objects.get(idcTrampas = id_trampas)
    if request.method == 'POST': 
        form = TrampaForm(request.POST, instance= trampa)
        if form.is_valid():
            form.save()
            messages.success(request, 'Trampa editada correctamente')
            return redirect('Trampa')
        

    else:
        form = TrampaForm(instance = trampa) 
    
    context = {'form':form}        
    return render(request, 'Trampas/editar_trampa.html',context)

def eliminarTrampa(request,id_trampas):
    trampa = Trampas.objects.get(idcTrampas = id_trampas)
    trampa.delete()
    messages.success(request, 'Trampa eliminada correctamente')
    return redirect('Trampa')
    
   


    
