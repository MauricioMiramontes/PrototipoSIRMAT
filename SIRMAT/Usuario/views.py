from django.http.response import JsonResponse
from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# Importamos el serializador del modelo Estereoscopio
from .serializers import UsuarioSerializer
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from django.contrib.auth import logout
from django.utils import timezone
from django.contrib.auth.signals import user_logged_in


from .Label_Studio_db import agregar_usuario_ls, eliminar_usuario_ls, editar_usuario_ls

# importar clase Authentication (LMRG)
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated


class UsuariosAPI(APIView):
    # Vistas de la API para la tabla 'estereoscopio' de la base de datos

    # Pedimos autenticacion por Token (LMRG)
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=JsonResponse):
        # Logica para una peticion tipo GET
        # Si se quiere ver un solo objeto es necesario proporcionar un parametro llamado 'id' con el valor
        # del idcUsuario que se desea ver, ejmpl: usuarios/?id=1

        if request.query_params:  # Revisamos si hay o no parametros dentro de la peticion HTTP

            # Se verifica que exista el parametro con llave 'id'
            try: request.query_params['id']
            except:
                return Response({
                    "message": "Solo se acepta un parametro con llave 'id'"
                },  status=status.HTTP_400_BAD_REQUEST)

            # Si los hay intentamos encontrar el elemento que coincida con el parametro 'id'
            try: usuario = User.objects.get(id=request.query_params['id'])
            except:  # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
                return Response({
                    'message': 'No se encontro ningun elemento que coincida con ese id'
                },  status=status.HTTP_404_NOT_FOUND)

            # Si el try no falla entonces creamos el serializador utilizando el objeto guardado en 'usuario'
            serializer = UsuarioSerializer(usuario)
        else:
            # Si no hay parameteros tomamos todos los objetos en la base de datos y los serializamos
            usuarios = User.objects.all()
            serializer = UsuarioSerializer(usuarios, many=True)

        # Respondemos con los datos que se hayan guardado en el serializador 'serializer'
        return Response(serializer.data)
        
    #----------------------------------------------------------------------------------------------------------------
    
    def put(self, request):
        # Logica para peticiones tipo PUT
        # Es necesario proporcionar un parametro llamado 'id' con el valor del idcUsuario que se desea actualizar
        # ejmpl: usuarios/?id=1

        if request.query_params:  # Revisamos si hay o no parametros dentro de la peticion HTTP
            # Si los hay intentamos encontrar el elemento que coincida con el parametro 'id'
            try:
                usuario = User.objects.get(id=request.query_params['id'])
            # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
            except:
                return Response({
                    'message': 'No hay parametro con nombre "id" o No se encontro ningun elemento que coincida con ese id'
                },  status=status.HTTP_404_NOT_FOUND)

            # Si el try no falla entonces creamos el serializador utilizando el objeto guardado en 'usuario'
            serializer = UsuarioSerializer(usuario, data=request.data)

            if serializer.is_valid():  # Si la peticion es valida
                # Actualizamos el serializador en la base de datos y en label studio
                serializer.save()
                editar_usuario_ls(usuario.id, usuario.email,
                                    request.data['password'])
                # Y respondemos con los datos del nuevo objeto creado
                return Response(serializer.data)
            else:  # Si la peticion no es valida respondemos con un error y un mensaje con los detalles del error
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:  # El parametro es requerido por lo que si no se proporciona se respondera un error
            return Response({
                'message': 'PUT debe proporcionar parametro "id"'
            },  status=status.HTTP_400_BAD_REQUEST)

    # --------------------------------------------------------------------------------------------------------------

    def delete(self, request):
        # Logica para una peticion DELETE
        # Es necesario proporcionar un parametro llamado 'id' con el valor del idcUsuario que se desea eliminar
        # ejmpl: usuarios/?id=1

        if request.query_params:  # Revisamos si hay o no parametros dentro de la peticion HTTP

            # Si los hay intentamos encontrar el elemento que coincida con el parametro 'id' y lo eliminamos
            try:
                usuario = User.objects.get(id=request.query_params['id'])

            # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
            except:

                return Response({
                    'message': 'No hay parametro con nombre "id" o No se encontro ningun elemento que coincida con ese id'
                },  status=status.HTTP_404_NOT_FOUND)

            # Si el try no falla entonces respondemos un mensaje de exito
            eliminar_usuario_ls(usuario.id)
            usuario.delete()
            return Response({
                'message': 'Usuario eliminado correctamente'
            }, status=status.HTTP_200_OK)

        else:  # El parametro es requerido por lo que si no se proporciona se respondera un error
            return Response({
                    'message' : 'DELETE debe proporcionar parametro "id"'
            },  status = status.HTTP_400_BAD_REQUEST)


class UsuariosSingUp(APIView):

      def post(self, request , format=JsonResponse):
        #Logica para una peticion tipo POST 
        
        #Tomamos los datos que vengan en la peticion HTTP y los des-serializamos para que Python los pueda usar
        serializer = UsuarioSerializer(data=request.data) 
        
        datos_respuesta = {}

        if serializer.is_valid(): #Si la peticion es valida
            nuevo_usuario = serializer.save() # Guardamos los datos del serializador en la base de datos
            token = Token.objects.get(user=nuevo_usuario).key # Obtenemos el token de ese usuario

            datos_respuesta['response'] = 'Usuario registrado de forma exitosa'
            datos_respuesta['user_data'] = {
                "id"         : nuevo_usuario.id,
                "email"      : nuevo_usuario.email,
                "username"   : nuevo_usuario.username, 
                "first_name" : nuevo_usuario.first_name,
                "last_name"  : nuevo_usuario.last_name
            }
            datos_respuesta['token'] = token

            # Agregamos un nuevo usuario a Label Studio con los mismos datos
            agregar_usuario_ls(nuevo_usuario.email, request.data['password'])

            return Response(datos_respuesta) # Y respondemos con los datos del nuevo objeto creado

        else: # Si la peticion no es valida respondemos con un error y un mensaje con los detalles del error
            return Response(
                serializer.errors, 
                status = status.HTTP_400_BAD_REQUEST  
            )


class CustomAuthToken(ObtainAuthToken):
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        datos_respuesta = {}
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        #Actualizamos el registro last_login
        user.last_login  = timezone.now()
        user.save(update_fields = ['last_login'])
    
        datos_respuesta['response'] = 'Inicio de Sesión Exitoso'
        datos_respuesta['token'] = token.key
        datos_respuesta['user_data'] = {
            "id"         : user.pk,
            "email"      : user.email,
            "username"   : user.username, 
            "first_name" : user.first_name,
            "last_name"  : user.last_name,
            "last_login" : user.last_login,
        }
        

        return Response(datos_respuesta)

 
class Logout(APIView):

    def post(self, request, *args, **kwargs):

        # Logica para una peticion POST de LOGOUT
        # Es necesario proporcionar en el body una variable llamada 'id' con el valor del idcUsuario con el que se desea cerrar la sesion
        
        #Se intenta encontrar un usuario que coincida con ese id 
        try: usuario = User.objects.get(id=request.data['id'])
        except: # Si no se encuentra se manda mensaje de error
            return Response(
                {
                    'error':'No se ha encontrado un usuario con estas credenciales'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Se intenta encontrar un token que este relacionado con ese usuario
        try: token = Token.objects.get(user=request.data['id'])
        except: # Si no se encuentra se manda un mensaje de error
            return Response(
                {
                    'error':'No hay token registrado para ese usuario'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Si se encontro el usuario y este tiene un token a su nombre entonces se elimina el token y se manda mensaje de exito 
        token.delete()
        return Response(
            {
                'message':'Sesion y token eliminados con exito'
            },
            status=status.HTTP_200_OK
        )

