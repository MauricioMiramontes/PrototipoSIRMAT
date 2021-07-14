from drf_yasg import openapi
from .serializers import UsuarioSerializer


class docs_get():
    # Detalles de la documentacion para GET de Usuarios

    # Los parametros que se aceptan en la operacion GET
    params = openapi.Parameter(
        'id',
        openapi.IN_QUERY,
        description="Parametro opcional en caso de que se requiera solo 1 registro",
        type=openapi.TYPE_INTEGER
    )

    user_schema = openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'id': openapi.Schema(
                type=openapi.TYPE_INTEGER,
                description='Numero único de identifiacion de cada Usuario'
            ),
            'last_login': openapi.Schema(
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_DATETIME,
                description='Ultima fecha en la que inicio sesion el usuario'
            ),
            'is_superuser': openapi.Schema(
                type=openapi.TYPE_BOOLEAN,
                description='Define si el usuario es o no administrador'
            ),
            'is_staff': openapi.Schema(
                type=openapi.TYPE_BOOLEAN,
                description='Define si el usuario es o no empleado'
            ),
            'date_joined': openapi.Schema(
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_DATETIME,
                description='Fecha en la que el usuario se registro'
            ),
            'telefono': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Numero telefonico del Usuario'
            ),
            'email': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Correo electronico del Usuario'
            ),
            'first_name': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Nombre del Usuario'
            ),
            'last_name': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Apellido del Usuario'
            ),
            'username': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Nombre de usuario'
            ),
            'is_active': openapi.Schema(
                type=openapi.TYPE_BOOLEAN,
                description='Determina si el usuario se ha dado o no de baja en el sistema'
            ),
        },
        required=['email', 'password', 'telefono', 'first_name', 'last_name']
    )

    # Posibles respuestas para POST una vez pasada la autenticacion
    respuestas = {
        "200": openapi.Response(
            schema=user_schema,
            description="Respuesta si la operacion GET fue exitosa",
        ),
        "404": openapi.Response(
            description="Respuesta si no se encuentra un registro con el id especificado",
            examples={
                "json": {
                    'message': 'No se encontro ningun elemento que coincida con ese id'
                }
            }
        ),
        "400": openapi.Response(
            description="Respuesta si se proporciono un parametro distinto a 'id'",
            examples={
                "json": {
                    "message": "Solo se acepta un parametro con llave 'id'"
                }
            }
        ),
        "403": openapi.Response(
            description="Solo usuarios administradores pueden hacer esta operacion",
            examples={
                "json": {
                    "error": "El usuario no tiene permisos para realizar esta accion"
                }
            }
        ),
    }

# ----------------------------------------------------------------------------------------


class docs_put():
    # Detalles de la documentacion para PUT de Usuarios

    # Los parametros que se aceptan en la operacion PUT
    params = openapi.Parameter(
        'id',
        openapi.IN_QUERY,
        description="Obligatorio. El 'id' del registro que se desea actualizar",
        type=openapi.TYPE_INTEGER,
        required=True,
    )

    # Posibles respuestas para PUT una vez pasada la autenticacion
    respuestas = {
        "200": openapi.Response(
            description="Respuesta si la operacion PUT fue exitosa",
            examples={
                'json': {
                    "id": 1,
                    "last_login": "2021-07-02T00:59:37.412740-05:00",
                    "is_superuser": True,
                    "is_staff": True,
                    "date_joined": "2021-05-26T00:52:17-05:00",
                    "telefono": "123432",
                    "email": "admin@user.com",
                    "first_name": "",
                    "last_name": "",
                    "username": "admin",
                    "is_active": True,
                    "groups": [],
                    "user_permissions": []
                }
            },
        ),
        "404": openapi.Response(
            description="Respuesta si no se encuentra un registro con el id especificado",
            examples={
                "json": {
                    'message': 'No se encontro ningun elemento que coincida con ese id'
                }
            }
        ),
        "400": openapi.Response(
            description="Posibles respuestas si la peticion no fue valida",
            examples={
                "json: Si se proporciono un parametro distinto a 'id'": {
                    "message": "Solo se acepta un parametro con llave 'id'"
                },
                "json: Algun campo faltante": {
                    "password": [
                        "Este campo es requerido."
                    ],
                    "telefono": [
                        "Este campo es requerido."
                    ],
                    "email": [
                        "Este campo es requerido."
                    ],
                    "first_name": [
                        "Este campo es requerido."
                    ],
                    "last_name": [
                        "Este campo es requerido."
                    ]
                },
                'json: Si la contraseña no cumple con los validadores': {
                    "password": [
                        "La contraseña es muy corta. Debe contener al menos 8 caracteres.",
                        "Esta contraseña es muy común.",
                        "Esta contraseña es totalmente numérica."
                    ],
                },
                'json: Si ya existe un usuario con ese correo registrado': {
                    "email": [
                        "Ya existe un/a usuario con este/a email."
                    ],
                },
                'json: Si no se proporciono ningun parametro': {
                    "message": "PUT debe proporcionar parametro 'id'"
                },
            }
        ),
        "403": openapi.Response(
            description="Solo usuarios administradores pueden hacer esta operacion",
            examples={
                "json": {
                    "error": "El usuario no tiene permisos para realizar esta accion"
                }
            }
        ),
    }

    # Como debe de ser el body de la peticion para ser valido
    body_valid = openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'email': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Correo electronico del Usuario'
            ),
            'password': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Contraseña del Usuario'
            ),
            'telefono': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Numero telefonico del Usuario'
            ),
            'first_name': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Nombre del Usuario'
            ),
            'last_name': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Apellido del Usuario'
            ),
        },
        required=['email', 'password', 'telefono', 'first_name', 'last_name']
    )

# ----------------------------------------------------------------------------------------


class docs_delete():
    # Detalles de la documentacion para DELETE de Usuarios

    # Los parametros que se aceptan en la operacion DELETE
    params = openapi.Parameter(
        'id',
        openapi.IN_QUERY,
        description="Obligatorio. El 'id' del registro que se desea eliminar",
        type=openapi.TYPE_INTEGER,
        required=True,
    )

    # Posibles respuestas para PUT una vez pasada la autenticacion
    respuestas = {
        "200": openapi.Response(
            description="Respuesta si la operacion DELETE fue exitosa",
            examples={
                "json": {
                    'message': 'Usuario eliminado correctamente'
                }
            }
        ),
        "404": openapi.Response(
            description="Respuesta si no se encuentra un registro con el id especificado",
            examples={
                "json": {
                    'message': 'No se encontro ningun elemento que coincida con ese id'
                }
            }
        ),
        "400": openapi.Response(
            description="Posibles respuestas si la peticion no fue valida",
            examples={
                "json: Si se proporciono un parametro distinto a 'id'": {
                    "message": "Solo se acepta un parametro con llave 'id'"
                },
                'json: Si no se proporciono ningun parametro': {
                    "message": "DELETE debe proporcionar parametro 'id'"
                },
            }
        ),
        "403": openapi.Response(
            description="Solo usuarios administradores o el propio usuario pueden hacer esta operacion",
            examples={
                "json": {
                    "error": "El usuario no tiene permisos para realizar esta accion"
                }
            }
        ),
    }

# --------------------------------------------------------------------------------------------


class docs_login():
    # Detalles de la documentacion para el inicio de sesion de Usuarios

    # Posibles respuestas para el inicio de sesion
    respuestas = {
        "200": openapi.Response(
            description="Respuesta si el inicio de sesion fue exitoso",
            examples={
                "json": {
                    "response": "Inicio de Sesión Exitoso",
                    "token": "c2b8f9e76d4d189f3693337d3bdc4c5b0c4bfc14",
                    "user_data": {
                        "id": 1,
                        "email": "some@email.con",
                        "first_name": "string",
                        "last_name": "string",
                        "last_login": "2021-07-02T05:59:37.412740Z",
                        "is_superuser": True,
                        "is_staff": True
                    }
                },
            }
        ),
        "400": openapi.Response(
            description="Posibles respuestas si la peticion no fue valida",
            examples={
                "json: Algun campo faltante": {
                    "username": [
                        "Este campo es requerido."
                    ],
                    "password": [
                        "Este campo es requerido."
                    ]
                },
                "json: Alguno de los datos es incorrecto": {
                    "non_field_errors": [
                        "No puede iniciar sesión con las credenciales proporcionadas."
                    ]
                },
            }
        ),
    }

    # Como debe de ser el body de la peticion para ser valido
    body_valid = openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'username': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Correo Electronico del Usuario',
            ),
            'password': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Contraseña del Usuario',
            ),
        },
        required=["username", "password"],
    )

# ----------------------------------------------------------------------------------------


class docs_logout():
    respuestas = {
        "200": openapi.Response(
            description="Respuesta si la sesion y el token se eliminaron con exito",
            examples={
                "json": {
                    "mensaje": "Sesion y token eleminados con exito"
                }
            },
        )}

# ----------------------------------------------------------------------------------------


class docs_signup():
    # Detalles de la documentacion para el registro de nuevos usuarios normales

    # Posibles respuestas para SignUp
    respuestas = {
        "200": openapi.Response(
            description="Respuesta si el registro de usuario nuevo fue exitoso",
            examples={
                'json': {
                    "message": "Usuario registrado de forma exitosa",
                    "token": "62ad5db0602b8c1fe9eb41654fc225db0ea3dd0d",
                    "user_data": {
                        "id": 38,
                        "email": "user@example.com",
                        "first_name": "string",
                        "last_name": "string",
                        "is_superuser": False,
                        "is_staff": False
                    }
                },
            }
        ),
        "400": openapi.Response(
            description="Posibles respuestas si la peticion no fue valida",
            examples={
                "json: Algun campo faltante": {
                    "password": [
                        "Este campo es requerido."
                    ],
                    "telefono": [
                        "Este campo es requerido."
                    ],
                    "email": [
                        "Este campo es requerido."
                    ],
                    "first_name": [
                        "Este campo es requerido."
                    ],
                    "last_name": [
                        "Este campo es requerido."
                    ]
                },
                'json: Si la contraseña no cumple con los validadores': {
                    "password": [
                        "La contraseña es muy corta. Debe contener al menos 8 caracteres.",
                        "Esta contraseña es muy común.",
                        "Esta contraseña es totalmente numérica."
                    ],
                },
                'json: Si ya existe un usuario con ese correo registrado': {
                    "email": [
                        "Ya existe un/a usuario con este/a email."
                    ],
                },
            }
        ),
    }

    # Como debe de ser el body de la peticion para ser valido
    body_valid = openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'email': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Correo electronico del Usuario'
            ),
            'password': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Contraseña del Usuario'
            ),
            'telefono': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Numero telefonico del Usuario'
            ),
            'first_name': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Nombre del Usuario'
            ),
            'last_name': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Apellido del Usuario'
            ),
        },
        required=['email', 'password', 'telefono', 'first_name', 'last_name']
    )

# ----------------------------------------------------------------------------------------


class docs_signup_admin():
    # Detalles de la documentacion para el registro de nuevos usuarios administradores

    # Posibles respuestas para SignUp
    respuestas = {
        "200": openapi.Response(
            description="Respuesta si el registro del administrador nuevo fue exitoso",
            examples={
                'json': {
                    "message": "Administrador registrado de forma exitosa",
                    "token": "62ad5db0602b8c1fe9eb41654fc225db0ea3dd0d",
                    "user_data": {
                        "id": 38,
                        "email": "admin@example.com",
                        "first_name": "string",
                        "last_name": "string",
                        "is_superuser": True,
                        "is_staff": True
                    }
                },
            }
        ),
        "400": openapi.Response(
            description="Posibles respuestas si la peticion no fue valida",
            examples={
                "json: Algun campo faltante": {
                    "password": [
                        "Este campo es requerido."
                    ],
                    "telefono": [
                        "Este campo es requerido."
                    ],
                    "email": [
                        "Este campo es requerido."
                    ],
                    "first_name": [
                        "Este campo es requerido."
                    ],
                    "last_name": [
                        "Este campo es requerido."
                    ]
                },
                'json: Si la contraseña no cumple con los validadores': {
                    "password": [
                        "La contraseña es muy corta. Debe contener al menos 8 caracteres.",
                        "Esta contraseña es muy común.",
                        "Esta contraseña es totalmente numérica."
                    ],
                },
                'json: Si ya existe un usuario con ese correo registrado': {
                    "email": [
                        "Ya existe un/a usuario con este/a email."
                    ],
                },
            }
        ),
        "403": openapi.Response(
            description="Solo usuarios administradores pueden hacer esta operacion",
            examples={
                "json": {
                    "error": "El usuario no tiene permisos para realizar esta accion"
                }
            }
        ),
    }

    # Como debe de ser el body de la peticion para ser valido
    body_valid = openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'email': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Correo electronico del Administrador'
            ),
            'password': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Contraseña del Administrador'
            ),
            'telefono': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Numero telefonico del Administrador'
            ),
            'first_name': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Nombre del Administrador'
            ),
            'last_name': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Apellido del Administrador'
            ),
        },
        required=['email', 'password', 'telefono', 'first_name', 'last_name']
    )

# ----------------------------------------------------------------------------------------


class docs_signup_staff():

    # Detalles de la documentacion para el registro de nuevos usuarios empleado

    # Posibles respuestas para SignUp
    respuestas = {
        "200": openapi.Response(
            description="Respuesta si el registro del empleado nuevo fue exitoso",
            examples={
                'json': {
                    "message": "Empleado registrado de forma exitosa",
                    "token": "62ad5db0602b8c1fe9eb41654fc225db0ea3dd0d",
                    "user_data": {
                        "id": 38,
                        "email": "staff@example.com",
                        "first_name": "string",
                        "last_name": "string",
                        "is_superuser": False,
                        "is_staff": True
                    }
                },
            }
        ),
        "400": openapi.Response(
            description="Posibles respuestas si la peticion no fue valida",
            examples={
                "json: Algun campo faltante": {
                    "password": [
                        "Este campo es requerido."
                    ],
                    "telefono": [
                        "Este campo es requerido."
                    ],
                    "email": [
                        "Este campo es requerido."
                    ],
                    "first_name": [
                        "Este campo es requerido."
                    ],
                    "last_name": [
                        "Este campo es requerido."
                    ]
                },
                'json: Si la contraseña no cumple con los validadores': {
                    "password": [
                        "La contraseña es muy corta. Debe contener al menos 8 caracteres.",
                        "Esta contraseña es muy común.",
                        "Esta contraseña es totalmente numérica."
                    ],
                },
                'json: Si ya existe un usuario con ese correo registrado': {
                    "email": [
                        "Ya existe un/a usuario con este/a email."
                    ],
                },
            }
        ),
        "403": openapi.Response(
            description="Solo usuarios administradores o el propio usuario pueden hacer esta operacion",
            examples={
                "json": {
                    "error": "El usuario no tiene permisos para realizar esta accion"
                }
            }
        ),
    }

    # Como debe de ser el body de la peticion para ser valido
    body_valid = openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'email': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Correo electronico del Empleado'
            ),
            'password': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Contraseña del Empleado'
            ),
            'telefono': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Numero telefonico del Empleado'
            ),
            'first_name': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Nombre del Empleado'
            ),
            'last_name': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Apellido del Empleado'
            ),
        },
        required=['email', 'password', 'telefono', 'first_name', 'last_name']
    )
