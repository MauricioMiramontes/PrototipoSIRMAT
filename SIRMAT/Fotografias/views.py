from Fotografias.Label_Studio_db import agregar_foto_ls
from django.shortcuts import render, redirect
from Fotografias.models import Fotografia
from Fotografias.forms import FotografiaForm
from django.contrib import messages

# Create your views here.

def fotografias(request):
    fotos=Fotografia.objects.all() #llamar a todos los objetos de mi modelo
    if request.method == 'GET': #si la peticion viene por get
        form= FotografiaForm() #llamar al formulario
    else:
        form= FotografiaForm(request.POST, request.FILES) #capturamos la informacion del formulario
        if form.is_valid(): #si el formulario es valido
            
            form.save() #guardar formulario en la base de datos
            fotoGuardada = Fotografia.objects.latest('idFotografias')
            print(type(fotoGuardada.idFotografias))
            agregar_foto_ls(fotoGuardada.idFotografias, request.FILES['fileFoto']._get_name(), 1, 1)
            messages.success(request, 'fotografia añadida correctamente')
            
            return redirect('Fotografia') #redireccionar a la vista trampas.html
        else:
            print (form.errors) #To see the form errors in the console. 
            messages.error(request, form.errors)
    return render(request, 'Fotos/fotos.html',{'fotos':fotos, 'form':form}) #contexto 'clave':valor

def eliminarFoto(request,id_foto):
    foto = Fotografia.objects.get(idFotografias = id_foto)
    foto.delete()
    messages.success(request, 'foto eliminada correctamente')
    return redirect('Fotografia')
