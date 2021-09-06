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

# Importaciones de documentacion Swagger
from drf_yasg.utils import swagger_auto_schema
from .docs import *


class UsuariosAPI(APIView):
    # Vistas de la API para la tabla 'estereoscopio' de la base de datos

    # Pedimos autenticacion por Token (LMRG)
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(manual_parameters=[docs_get.params], responses=docs_get.respuestas)
    def get(self, request, format=JsonResponse):
        # Logica para una peticion tipo GET
        # Si se quiere ver un solo objeto es necesario proporcionar un parametro llamado 'id' con el valor
        # del idcUsuario que se desea ver, ejmpl: usuarios/?id=1

        if not request.user.is_superuser:
            return Response({
                "error": "El usuario no tiene permisos para realizar esta accion"
            },  status=status.HTTP_403_FORBIDDEN)

        if request.query_params:  # Revisamos si hay o no parametros dentro de la peticion HTTP

            # Se verifica que exista el parametro con llave 'id'
            try:
                request.query_params['id']
            except:
                return Response({
                    "message": "Solo se acepta un parametro con llave 'id'"
                },  status=status.HTTP_400_BAD_REQUEST)

            # Si los hay intentamos encontrar el elemento que coincida con el parametro 'id'
            try:
                usuario = User.objects.get(id=request.query_params['id'])
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

        if not serializer.data:
            # Si aun no hay registros mandamos una respuesta con el error y un mensaje con detalles
            return Response({
                'message': 'Aun no se tiene ningún registro en la base de datos'
            },  status=status.HTTP_204_NO_CONTENT)
        # Respondemos con los datos que se hayan guardado en el serializador 'serializer'
        return Response(serializer.data)

    # ----------------------------------------------------------------------------------------------------------------

    @swagger_auto_schema(manual_parameters=[docs_put.params], responses=docs_put.respuestas, request_body=docs_put.body_valid)
    def put(self, request):
        # Logica para peticiones tipo PUT
        # Es necesario proporcionar un parametro llamado 'id' con el valor del idcUsuario que se desea actualizar
        # ejmpl: usuarios/?id=1

        # Revisamos que la accion sea realizada por un super usuario o si el usuario se edita a si mismo
        if request.user.is_superuser or str(request.user.id) == request.query_params['id']:

            if request.query_params:  # Revisamos si hay o no parametros dentro de la peticion HTTP

                # Se verifica que exista el parametro con llave 'id'
                try:
                    request.query_params['id']
                except:
                    return Response({
                        "message": "La unica llave de parametros aceptada 'id'"
                    },  status=status.HTTP_400_BAD_REQUEST)

                # Si los hay intentamos encontrar el elemento que coincida con el parametro 'id'
                try:
                    usuario = User.objects.get(id=request.query_params['id'])
                # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
                except:
                    return Response({
                        'message': 'No se encontro ningun elemento que coincida con ese id'
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
        else:
            return Response({
                "error": "El usuario no tiene permisos para realizar esta accion"
            },  status=status.HTTP_403_FORBIDDEN)

    # --------------------------------------------------------------------------------------------------------------

    @swagger_auto_schema(manual_parameters=[docs_delete.params], responses=docs_delete.respuestas)
    def delete(self, request):
        # Logica para una peticion DELETE
        # Es necesario proporcionar un parametro llamado 'id' con el valor del idcUsuario que se desea eliminar
        # ejmpl: usuarios/?id=1

        # Revisamos que la accion sea realizada por un super usuario o si el usuario se edita si mismo
        if request.user.is_superuser or str(request.user.id) == request.query_params['id']:

            if request.query_params:  # Revisamos si hay o no parametros dentro de la peticion HTTP

                # Se verifica que exista el parametro con llave 'id'
                try:
                    request.query_params['id']
                except:
                    return Response({
                        "message": "Solo se acepta un parametro con llave 'id'"
                    },  status=status.HTTP_400_BAD_REQUEST)

                # Si los hay intentamos encontrar el elemento que coincida con el parametro 'id' y lo eliminamos
                try:
                    usuario = User.objects.get(id=request.query_params['id'])

                # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
                except:

                    return Response({
                        'message': 'No se encontro ningun elemento que coincida con ese id'
                    },  status=status.HTTP_404_NOT_FOUND)

                # Si el try no falla entonces cambiamos el registro is_active de la BD

                usuario.is_active = False  # cambiamos is_active a False
                # guardamos los cambios
                usuario.save(update_fields=['is_active'])
                # eliminamos usuario de LabelStudio
                eliminar_usuario_ls(usuario.id)
                # Enviamos mensaje de éxito
                return Response({
                    'message': 'Usuario dado de baja correctamente'
                }, status=status.HTTP_200_OK)

            else:  # El parametro es requerido por lo que si no se proporciona se respondera un error
                return Response({
                    'message': 'DELETE debe proporcionar parametro "id"'
                },  status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "error": "El usuario no tiene permisos para realizar esta accion"
            },  status=status.HTTP_403_FORBIDDEN)


class UsuariosSingUp(APIView):

    @swagger_auto_schema(responses=docs_signup.respuestas, request_body=docs_signup.body_valid)
    def post(self, request, format=JsonResponse):
        # Logica para una peticion tipo POST

        # Tomamos los datos que vengan en la peticion HTTP y los des-serializamos para que Python los pueda usar
        serializer = UsuarioSerializer(data=request.data)

        datos_respuesta = {}

        if serializer.is_valid():  # Si la peticion es valida
            # Guardamos los datos del serializador en la base de datos

            nuevo_usuario = serializer.save()

            # Obtenemos el token de ese usuario
            token = Token.objects.get(user=nuevo_usuario).key

            datos_respuesta['message'] = 'Usuario registrado de forma exitosa'
            datos_respuesta['token'] = token
            datos_respuesta['data'] = {
                "id": nuevo_usuario.id,
                "email": nuevo_usuario.email,
                "first_name": nuevo_usuario.first_name,
                "last_name": nuevo_usuario.last_name,
                "is_superuser": nuevo_usuario.is_superuser,
                "is_staff": nuevo_usuario.is_staff,
                "is_active": nuevo_usuario.is_active,
            }

            # Agregamos un nuevo usuario a Label Studio con los mismos datos
            agregar_usuario_ls(nuevo_usuario.email, request.data['password'])

            # Y respondemos con los datos del nuevo objeto creado
            return Response(datos_respuesta)

        else:  # Si la peticion no es valida respondemos con un error y un mensaje con los detalles del error
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )


class CustomAuthToken(ObtainAuthToken):

    @swagger_auto_schema(responses=docs_login.respuestas, request_body=docs_login.body_valid)
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        datos_respuesta = {}
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        # Actualizamos el registro last_login
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        datos_respuesta['response'] = 'Inicio de Sesión Exitoso'
        datos_respuesta['token'] = token.key
        datos_respuesta['data'] = {
            "id": user.pk,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "last_login": user.last_login,
            "is_superuser": user.is_superuser,
            "is_staff": user.is_staff
        }

        return Response(datos_respuesta)


class Logout(APIView):
    # Pedimos autenticacion por token
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(responses=docs_logout.respuestas)
    def post(self, request, format=JsonResponse):
        # Logica para una peticion POST de LOGOUT
        # Se toma el token de quien manda el logout y se elimina
        token = Token.objects.get(user=request.user)
        token.delete()
        # Mandamos un mensaje con detalles
        return Response({
            "mensaje": "Sesion y token eliminados con exito "
        },  status=status.HTTP_200_OK)


class UsuariosSignUpAdmin(APIView):

    @swagger_auto_schema(responses=docs_signup_admin.respuestas, request_body=docs_signup_admin.body_valid)
    def post(self, request, format=JsonResponse):
        # Logica para una peticion tipo POST

        # Tomamos los datos que vengan en la peticion HTTP y los des-serializamos para que Python los pueda usar
        serializer = UsuarioSerializer(data=request.data)
        # Verificamos que el usuario sea administrador
        if not request.user.is_superuser == True:
            return Response({
                "error": "El usuario no tiene permisos para realizar esta accion"
            },  status=status.HTTP_403_FORBIDDEN)

        datos_respuesta = {}

        if serializer.is_valid():  # Si la peticion es valida
            # Guardamos los datos del serializador en la base de datos
            nuevo_usuario = serializer.save()
            # Cambiamos las variables del usuario
            nuevo_usuario.is_superuser = True
            nuevo_usuario.is_staff = True
            nuevo_usuario.save()
            # Obtenemos el token de ese usuario
            token = Token.objects.get(user=nuevo_usuario).key

            datos_respuesta['message'] = 'Administrador registrado de forma exitosa'
            datos_respuesta['token'] = token
            datos_respuesta['data'] = {
                "id": nuevo_usuario.id,
                "email": nuevo_usuario.email,
                "first_name": nuevo_usuario.first_name,
                "last_name": nuevo_usuario.last_name,
                "is_superuser": nuevo_usuario.is_superuser,
                "is_staff": nuevo_usuario.is_staff,
                "is_active": nuevo_usuario.is_active,
            }

            # Agregamos un nuevo usuario a Label Studio con los mismos datos
            agregar_usuario_ls(nuevo_usuario.email, request.data['password'])

            # Y respondemos con los datos del nuevo objeto creado
            return Response(datos_respuesta)

        else:  # Si la peticion no es valida respondemos con un error y un mensaje con los detalles del error
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )


class UsuariosSignUpStaff(APIView):

    @swagger_auto_schema(responses=docs_signup_staff.respuestas, request_body=docs_signup_staff.body_valid)
    def post(self, request, format=JsonResponse):
        # Logica para una peticion tipo POST

        # Tomamos los datos que vengan en la peticion HTTP y los des-serializamos para que Python los pueda usar
        serializer = UsuarioSerializer(data=request.data)
        # Verificamos que el usuario sea administrador
        if not request.user.is_superuser == True:
            return Response({
                "error": "El usuario no tiene permisos para realizar esta accion"
            },  status=status.HTTP_403_FORBIDDEN)

        datos_respuesta = {}

        if serializer.is_valid():  # Si la peticion es valida
            # Guardamos los datos del serializador en la base de datos
            nuevo_usuario = serializer.save()
            # Cambiamos las variables del usuario
            nuevo_usuario.is_staff = True
            nuevo_usuario.save()
            # Obtenemos el token de ese usuario
            token = Token.objects.get(user=nuevo_usuario).key

            datos_respuesta['message'] = 'Empleado registrado de forma exitosa'
            datos_respuesta['token'] = token
            datos_respuesta['data'] = {
                "id": nuevo_usuario.id,
                "email": nuevo_usuario.email,
                "first_name": nuevo_usuario.first_name,
                "last_name": nuevo_usuario.last_name,
                "is_superuser": nuevo_usuario.is_superuser,
                "is_staff": nuevo_usuario.is_staff,
                "is_active" : nuevo_usuario.is_active,
            }

            # Agregamos un nuevo usuario a Label Studio con los mismos datos
            agregar_usuario_ls(nuevo_usuario.email, request.data['password'])

            # Y respondemos con los datos del nuevo objeto creado
            return Response(datos_respuesta)

        else:  # Si la peticion no es valida respondemos con un error y un mensaje con los detalles del error
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )


class DeleteUser(APIView):
    # Vistas de la API para la elminiar un registro 'usuarios' de la base de datos

    # Pedimos autenticacion por Token (LMRG)
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        # Logica para peticiones tipo DELETE
        # Es necesario proporcionar un parametro llamado 'id' con el valor del idcUsuario que se desea eliminar
        # ejmpl: usuarios/?id=1

        # Revisamos que la accion sea realizada por un super usuario o si el usuario se esta intentando eliminar a si mismo
        if request.user.is_superuser or str(request.user.id) == request.query_params['id']:

            if request.query_params:  # Revisamos si hay o no parametros dentro de la peticion HTTP

                # Se verifica que exista el parametro con llave 'id'
                try:
                    request.query_params['id']
                except:
                    return Response({
                        "message": "La unica llave de parametros aceptada 'id'"
                    },  status=status.HTTP_400_BAD_REQUEST)

                # Si los hay intentamos encontrar el elemento que coincida con el parametro 'id'
                try:
                    usuario = User.objects.get(id=request.query_params['id'])
                # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
                except:
                    return Response({
                        'message': 'No se encontro ningun elemento que coincida con ese id'
                    },  status=status.HTTP_404_NOT_FOUND)

                # eliminamos usuario de LabelStudio
                eliminar_usuario_ls(usuario.id)

                # Eliminamos el usuario de los registros
                usuario.delete()

                # Se responde con un mensaje de exito
                # Enviamos mensaje de éxito
                return Response({
                    'message': 'Usuario eliminado correctamente'
                }, status=status.HTTP_200_OK)


            else:  # El parametro es requerido por lo que si no se proporciona se respondera un error
                return Response({
                    'message': 'DELETE debe proporcionar parametro "id"'
                },  status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "error": "El usuario no tiene permisos para realizar esta accion"
            },  status=status.HTTP_403_FORBIDDEN)

    # --------------------------------------------------------------------------------------------------------------

    print("Hola")
