from django.http.response import JsonResponse
from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UsuarioSerializer, UsuarioTokenSerializer #Importamos el serializador del modelo Estereoscopio

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.sessions.models import Session #clase que maneja las sesiónes
from datetime import datetime

class UsuariosAPI(APIView):
    # Vistas de la API para la tabla 'estereoscopio' de la base de datos

    def get(self, request, format=JsonResponse):
        # Logica para una peticion tipo GET
        # Si se quiere ver un solo objeto es necesario proporcionar un parametro llamado 'id' con el valor
        # del idcUsuario que se desea ver, ejmpl: usuarios/?id=1

        if request.query_params: #Revisamos si hay o no parametros dentro de la peticion HTTP

            # Si los hay intentamos encontrar el elemento que coincida con el parametro 'id'
            try: usuario = User.objects.get(id = request.query_params['id'])
            # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
            except: 
                return Response({
                    'message' : 'No hay parametro con nombre "id" o No se encontro ningun elemento que coincida con ese id'
                },  status = status.HTTP_404_NOT_FOUND) 

            # Si el try no falla entonces creamos el serializador utilizando el objeto guardado en 'usuario'
            serializer = UsuarioSerializer(usuario)   
        else:
            # Si no hay parameteros tomamos todos los objetos en la base de datos y los serializamos
            usuarios = User.objects.all()
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
            try: usuario = User.objects.get(id = request.query_params['id']) 
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
            try: usuario = User.objects.get(id = request.query_params['id']) 
                 
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

class Login(ObtainAuthToken):
   
    def post(self,request,*args,**kwargs):
        #el request va a recibir el username y el password
        login_serializer = self.serializer_class(data= request.data, context = {'request':request}) # la clase ObtainAuthToken ya tiene definido el serilizer(contiene campos username y password)
        if login_serializer.is_valid(): #si existe el usuario y contraseña en la base de datos
            user = login_serializer.validated_data['user'] #usuario
            if user.is_active: #si el usuario está activo
                token,created = Token.objects.get_or_create(user = user) #trae el token para ese usuario y si no existe lo crea
                user_serializer = UsuarioTokenSerializer(user) 
                if created: #si se crea el token
                    return Response({
                        'token': token.key,
                        'user': user_serializer.data,
                        'message':'Inicio de sesión exitoso'
                    },status= status.HTTP_201_CREATED)
                else: #si el token ya fue creado
                    """
                    all_sessions = Session.objects.filter(expire_date__gte = datetime.now())#todas las sesiones con tiempo de expiracion mayor o igual a la hora actual
                    if all_sessions.exists(): # si hay sesiones
                        #busca en las sesiones aquella que corresponda con el usuario actual
                        for session in all_sessions: 
                            session_data = session.get_decoded()
                            if user.id == int(session_data.get('_auth_user_id')): #si hay más de una
                                session.delete() #borra la sesión
                    token.delete() #borramos el token
                    token = Token.objects.create(user = user)# y creamos un nuevo token
                    return Response({
                        'token': token.key,
                        'user': user_serializer.data,
                        'message':'Inicio de sesión exitoso'
                    },status= status.HTTP_201_CREATED)
                    """
                    token.delete()
                    return Response({
                        'error': 'Ya se ha iniciado sesión con este usuario' 
                    },status=status.HTTP_409_CONFLICT)
            else:
                return Response({'error':'Este usuario no puede iniciar sesión'},status = status.HTTP_401_UNAUTHORIZED)
        else: #si el usuario no es valido
            return Response({'error':'Nombre de usuario o contraseña incorrectos.'},status = status.HTTP_400_BAD_REQUEST)

        return Response({'mensaje':'Hola desde Response'}, status = status.HTTP_200_OK)

class Logout(APIView):

    def get(self, request, *args, **kwargs):
        try:
            token = request.GET.get('token') #traemos el token 
            token = Token.objects.filter(key = token).first()

            if token:
                user = token.user

                all_sessions = Session.objects.filter(expire_date__gte = datetime.now())#todas las sesiones con tiempo de expiracion mayor o igual a la hora actual
                if all_sessions.exists(): # si hay sesiones
                    #busca en las sesiones aquella que corresponda con el usuario actual
                    for session in all_sessions: 
                        session_data = session.get_decoded()
                        if user.id == int(session_data.get('_auth_user_id')): #si hay más de una
                            session.delete() #borra la sesión
                token.delete()
                session_message = 'Sesiones de usuario eliminadas'
                token_message ='Token eliminado'
                return Response({'token_message': token_message, 'session_message':session_message},
                                    status= status.HTTP_200_OK)

            return Response({'error':'No se ha encontrado n usuario con estas credenciales'},
                                    status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error':'No se ha encontrado token en la peticion'},
                                    status=status.HTTP_409_CONFLICT)
            
class UserToken(APIView):
    def get(self,request,*args,**kwargs):
        username = request.GET.get('username')
        try:
            user_token = Token.objects.get(user = UsuarioTokenSerializer().Meta.model.objects.filter(username = username).first())
            return Response({'token':user_token.key})
        except:
            return Response({'error':'credenciales enviadas incorrectas'},status=status.HTTP_400_BAD_REQUEST)