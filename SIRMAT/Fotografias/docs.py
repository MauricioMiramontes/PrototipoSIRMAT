from drf_yasg import openapi, utils
from .serializers import FotografiaSerializer


class docs_get():
    # Detalles de la documentacion para GET de Fotografias

    # Los parametros que se aceptan en la operacion GET
    params = [
        openapi.Parameter(
        'id',
        openapi.IN_QUERY,
        description="Parametro opcional en caso de que se requiera solo 1 registro mutuamente excluyente con 'muestra'",
        type=openapi.TYPE_INTEGER
        ),
        openapi.Parameter(
        'muestra',
        openapi.IN_QUERY,
        description="Parametro opcional en caso de que requira las fotografias de una sola muestra, mutuamente excluyente con 'id'",
        type=openapi.TYPE_INTEGER
        )
    ]

    # Posibles respuestas para POST una vez pasada la autenticacion
    respuestas = {
        "200": openapi.Response(
            schema=FotografiaSerializer(),
            description="Respuesta si la operacion GET fue exitosa",
        ),
        "404": openapi.Response(
            description="Respuesta si no se encuentran los registros especificados",
            examples={
                "json: No se encontro un elemento con ese 'id'": {
                    'message': 'No se encontro ningun elemento que coincida con ese id'
                },
                "json: No se encontraron elementos pertenecientes a esa 'muestra'": {
                    'message': 'No se encontro ningun elemento que coincida con esa muestra'
                },

            }
        ),
        "400": openapi.Response(
            description="Respuestas posibles por mandar un peticion con parametros erroneos",
            examples={
                "json: Se envia un parametro distinto a 'id' o 'muestra'": {
                    "message": "Solo se acepta un parametro con llave 'id' o 'muestra'"
                },
                "json: Se envia al mismo tiempo el parametro 'id' y 'muestra'": {
                    "message":  "'id' y 'muestra' son mutuamente excluyentes"
                },
            }
        ),
        "204": openapi.Response(
            description="Respuesta si no se tienen ningun registros en la base de datos",
            examples={
                "json": {
                    'message': 'Aun no se tiene ning??n registro en la base de datos'
                }
            }
        ),
    }

# ----------------------------------------------------------------------------------------


class docs_post():
    # Detalles de la documentacion para POST de Fotografias

    # Posibles respuestas para POST una vez pasada la autenticacion
    respuestas = {
        "200": openapi.Response(
            schema=FotografiaSerializer(),
            description="Respuesta si la operacion POST fue exitosa"
        ),
        "403": openapi.Response(
            description="Solo usuarios administradores pueden hacer esta operacion",
            examples={
                "json": {
                    "error": "El usuario no tiene permisos para realizar esta accion"
                }
            }
        ),
        "400": openapi.Response(
            description="Posibles respuestas si la peticion no fue valida",
            examples={
                "json: Algun campo faltante": {
                    "zoom": [
                        "Este campo es requerido."
                    ],
                    "resolucion": [
                        "Este campo es requerido."
                    ],
                    "fileFoto": [
                        "No se envi?? ning??n archivo."
                    ],
                    "idCamara": [
                        "Este campo es requerido."
                    ],
                    "idMuestra": [
                        "Este campo es requerido."
                    ]
                },
                'json: Si no se encuentra una Camara con ese id': {
                    "idCamara": [
                        "Clave primaria \"0\" inv??lida - objeto no existe."
                    ]
                },
                'json: Si no se encuentra una Muestra con ese id': {
                    "idMuestra": [
                        "Clave primaria \"0\" inv??lida - objeto no existe."
                    ]
                },
            }
        ),
    }

    # Como debe de ser el body de la peticion para ser valido
    body_valid = FotografiaSerializer

# ----------------------------------------------------------------------------------------


class docs_put():
    # Detalles de la documentacion para PUT de Fotografias

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
            schema=FotografiaSerializer(),
            description="Respuesta si la operacion PUT fue exitosa"
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
                    "zoom": [
                        "Este campo es requerido."
                    ],
                    "resolucion": [
                        "Este campo es requerido."
                    ],
                    "fileFoto": [
                        "No se envi?? ning??n archivo."
                    ],
                    "idCamara": [
                        "Este campo es requerido."
                    ],
                    "idMuestra": [
                        "Este campo es requerido."
                    ]
                },
                'json: Si no se encuentra una Camara con ese id': {
                    "idCamara": [
                        "Clave primaria \"0\" inv??lida - objeto no existe."
                    ]
                },
                'json: Si no se encuentra una Muestra con ese id': {
                    "idMuestra": [
                        "Clave primaria \"0\" inv??lida - objeto no existe."
                    ]
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
    body_valid = FotografiaSerializer

# ----------------------------------------------------------------------------------------


class docs_delete():
    # Detalles de la documentacion para DELETE de Fotografias

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
                    'message': 'Fotografia eliminado correctamente'
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
            description="Solo usuarios administradores pueden hacer esta operacion",
            examples={
                "json": {
                    "error": "El usuario no tiene permisos para realizar esta accion"
                }
            }
        ),
    }

# --------------------------------------------------------------------------------------------
