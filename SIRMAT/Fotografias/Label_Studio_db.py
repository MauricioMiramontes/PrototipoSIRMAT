import datetime
import os
import sqlite3
from pathlib import Path

DIR = Path(__file__).resolve().parent.parent


def agregar_foto_ls(id_foto, nombre_foto, id_usuario, id_proyecto):
    """
    Funcion para agregar un nuevo registro en la tabla tabla task y data_import_fileupload de label studio, 
    
    El nuevo registro se hara en base a cada fotografia nueva que se haya agregado a la base de datos SIRMAT

    :param     id_foto: id de la foto que se usara para identificar el registro a agregar
    :type      id_foto: str
    :param nombre_foto: El nombre de la fotografia subida para que label studio la pueda identificar
    :type  nombre_foto: str
    :param  id_usuario: id del usuario registrado que haya agregado la fotografia
    :type      id_foto: str
    :param id_proyecto: id de la muestra a la que pertenece la fotografia
    :type  id_proyecto: str

    """
    
    # Se revisa primero si existe el archivo de la base de datos de label studio 
    # Este archivo lo genera automaticamente label studio cuando se inicia por primera vez

    if os.path.exists(str(DIR) + '/Label_Studio_data/label_studio.sqlite3'):
        # Se crea conexion a base de datos
        try: 
            con = sqlite3.connect(str(DIR) + '/Label_Studio_data/label_studio.sqlite3')
            cur = con.cursor()
        except:
            print('Error: No fue posible crear la conexion a la base de datos de label studio')
            return()
    else: 
        print('Error: No existe el archivo label_studio.sqlite3 dentro de Label_Studio_data')
        return()
    
    # Se define la hora y fecha actual
    now = datetime.datetime.now()

    data_import_fileupload = [(
        id_foto,                 # id     
        'upload/'+nombre_foto,   # file
        id_usuario,              # project_id
        id_proyecto              # user_id
    )]
    
    data_task_ls = [(
        id_foto,                                          # id
        '{"image": "/data/upload/'+ nombre_foto +'"}',    # data
        now,                                              # created_at
        now,                                              # updated_at
        0,                                                # is_labeled
        id_proyecto,                                      # project_id
        1,                                                # overlap
        id_foto,                                          # file_upload_id
        '{}'                                              # meta
    )]

    try: 
        cur.executemany("insert into data_import_fileupload values (?, ?, ?, ?)", data_import_fileupload)
        cur.executemany("insert into task values (?, ?, ?, ?, ?, ?, ?, ?, ?)", data_task_ls)
    except:
        con.close()
        print('Error: No fue posible agregar la foto de label studio')
        return()

    con.commit()
    con.close()
    print("Imagen agregada a label studio: ")
    print(data_import_fileupload)
    print("Task Agregado a Label Studio: ")
    print(data_task_ls)

#---------------------------------------------------------------------------------------------------------------

def eliminar_foto_ls(id):

    """
    Funcion para eliminar un nuevo registro en la tabla task y data_import_fileupload  de label studio, 
    El registro eliminado sera que tenga el mismo id que la fotografia eliminada en la base de datos SIRMAT 

    :param id: id de la muestra que se usara para identificar el registro a eliminar
    :type  id: str

    """

    # Se revisa primero si existe el archivo de la base de datos de label studio 
    # Este archivo lo genera automaticamente label studio cuando se inicia por primera vez

    if os.path.exists(str(DIR) + '/Label_Studio_data/label_studio.sqlite3'):
         # Se crea conexion a base de datos
        try: 
            con = sqlite3.connect(str(DIR) + '/Label_Studio_data/label_studio.sqlite3')
            cur = con.cursor()
        except:
            print('Error: No fue posible crear la conexion a la base de datos de label studio')
            return()
    else: 
        print('Error: No existe el archivo label_studio.sqlite3 dentro de Label_Studio_data')
        return()

    # Se crea el Query SQL para llevar a cabo la accion
    sql_data = 'DELETE FROM data_import_fileupload WHERE id=?'
    sql_task = 'DELETE FROM task WHERE id=?'


    # Se ejecuta el Query
    try: 
        cur.execute(sql_data, (id,))
        cur.execute(sql_task, (id,))
    except:
        con.close()
        print('Error: No fue posible eliminar la muestra de la base de datos de label studio')
        return()
        
    # Se guardan los cambios en la base de datos
    con.commit()
    con.close()
    print('Fotografia eliminada en label studio')

#-----------------------------------------------------------------------------------------------------------------
