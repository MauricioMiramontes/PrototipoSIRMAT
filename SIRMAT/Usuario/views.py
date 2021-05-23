from django.http.response import JsonResponse
from .models import Usuario
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UsuarioSerializer #Importamos el serializador del modelo Estereoscopio

class UsuariosAPI(APIView):
    # Vistas de la API para la tabla 'estereoscopio' de la base de datos

    def get(self, request, format=JsonResponse):
        # Logica para una peticion tipo GET
        # Si se quiere ver un solo objeto es necesario proporcionar un parametro llamado 'id' con el valor
        # del idcUsuario que se desea ver, ejmpl: usuarios/?id=1

        if request.query_params: #Revisamos si hay o no parametros dentro de la peticion HTTP

            # Si los hay intentamos encontrar el elemento que coincida con el parametro 'id'
            try: usuario = Usuario.objects.get(idcUsuario = request.query_params['id'])
            # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
            except: 
                return Response({
                    'message' : 'No hay parametro con nombre "id" o No se encontro ningun elemento que coincida con ese id'
                },  status = status.HTTP_404_NOT_FOUND) 

            # Si el try no falla entonces creamos el serializador utilizando el objeto guardado en 'usuario'
            serializer = UsuarioSerializer(usuario)   
        else:
            # Si no hay parameteros tomamos todos los objetos en la base de datos y los serializamos
            usuarios = Usuario.objects.all()
            serializer = UsuarioSerializer(usuarios, many = True)

        # Respondemos con los datos que se hayan guardado en el serializador 'serializer'
        return Response(serializer.data)

    #------------------------------------------------------------------------------------
    
    def post(self, request):
        #Logica para una peticion tipo POST 
        
        #Tomamos los datos que vengan en la peticion HTTP y los des-serializamos para que Python los pueda usar
        serializer = UsuarioSerializer(data=request.data) 
        
        if serializer.is_valid(): #Si la peticion es valida 
            serializer.save() # Guardamos los datos del serializador en la base de datos
            return Response(serializer.data) # Y respondemos con los datos del nuevo objeto creado
        else: # Si la peticion no es valida respondemos con un error y un mensaje con los detalles del error
            return Response(
                serializer.errors, 
                status = status.HTTP_400_BAD_REQUEST  
            )

    #----------------------------------------------------------------------------------------------------------------

    def put(self, request):
        #Logica para peticiones tipo PUT
        # Es necesario proporcionar un parametro llamado 'id' con el valor del idcUsuario que se desea actualizar 
        # ejmpl: usuarios/?id=1

        if request.query_params: #Revisamos si hay o no parametros dentro de la peticion HTTP
            # Si los hay intentamos encontrar el elemento que coincida con el parametro 'id'
            try: usuario = Usuario.objects.get(idcUsuario = request.query_params['id']) 
            # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
            except: 
                return Response({
                    'message' : 'No hay parametro con nombre "id" o No se encontro ningun elemento que coincida con ese id'
                },  status = status.HTTP_404_NOT_FOUND)

            # Si el try no falla entonces creamos el serializador utilizando el objeto guardado en 'usuario'
            serializer = UsuarioSerializer(usuario, data = request.data)

            if serializer.is_valid():# Si la peticion es valida 
                serializer.save() #Actualizamos el serializador en la base de datos
                return Response(serializer.data)  # Y respondemos con los datos del nuevo objeto creado
            else: # Si la peticion no es valida respondemos con un error y un mensaje con los detalles del error
                return Response(
                    serializer.errors, 
                    status = status.HTTP_400_BAD_REQUEST
                ) 
        else: # El parametro es requerido por lo que si no se proporciona se respondera un error
            return Response({
                    'message' : 'PUT debe proporcionar parametro "id"'
                },  status = status.HTTP_400_BAD_REQUEST)

    #--------------------------------------------------------------------------------------------------------------

    def delete(self, request):
        # Logica para una peticion DELETE
        # Es necesario proporcionar un parametro llamado 'id' con el valor del idcUsuario que se desea eliminar 
        # ejmpl: usuarios/?id=1
        
        if request.query_params: #Revisamos si hay o no parametros dentro de la peticion HTTP

            # Si los hay intentamos encontrar el elemento que coincida con el parametro 'id' y lo eliminamos
            try: usuario = Usuario.objects.get(idcUsuario = request.query_params['id']) 
                 
            # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
            except: 
                
                return Response({
                    'message' : 'No hay parametro con nombre "id" o No se encontro ningun elemento que coincida con ese id'
                },  status = status.HTTP_404_NOT_FOUND) 
          
            # Si el try no falla entonces respondemos un mensaje de exito
            usuario.delete()
            return Response({
                'message' : 'Muestra eliminada correctamente'
            }, status = status.HTTP_200_OK)

        else: # El parametro es requerido por lo que si no se proporciona se respondera un error
            return Response({
                    'message' : 'DELETE debe proporcionar parametro "id"'
                },  status = status.HTTP_400_BAD_REQUEST)
