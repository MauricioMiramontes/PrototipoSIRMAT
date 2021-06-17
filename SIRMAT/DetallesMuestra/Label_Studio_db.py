import sqlite3
from pathlib import Path
import os

DIR = Path(__file__).resolve().parent.parent

def agregar_detallesMuestra_ls(id_muestra, descripcion):
    """
    Funcion para agregar un nuevo registro en la tabla de project de label studio, 
    El nuevo registro se hara en base a cada muestra nueva que se haya agregado a la base de datos SIRMAT

    :param id_muestra: id de la muestra que se usara para definir id del registro 
    :type  id_muestra: str
    :param id_usuario: id del usuario que se usara para definir id del creador del registro
    :type  id_usuario: str
    :param      title: titulo que se pondra en el campo 'title' del registro y sirve como el nombre del proyecto en label studio
    :type       title: str

    """

    # Se revisa primero si existe el archivo de la base de datos de label studio 
    # Este archivo lo genera automaticamente label studio cuando se inicia por primera vez

    if os.path.exists(str(DIR) + '/Label_Studio_Data/label_studio.sqlite3'):
         # Se crea conexion a base de datos
        try: 
            con = sqlite3.connect(str(DIR) + '/Label_Studio_Data/label_studio.sqlite3')
            cur = con.cursor()
        except:
            print('Error: No fue posible crear la conexion a la base de datos de label studio')
            return()
    else: 
        print('Error: No existe el archivo label_studio.sqlite3 dentro de Label_Studio_data')
        return()
    

    # Se guardan los datos en una tupla 
    data = [(
        descripcion,                # description
        id_muestra                  # id
    )]

    # Se ejecuta el Query de SQL con los datos guardados en data y se usa commit para guardar los cambios
    try: 
        cur.executemany("UPDATE project SET description = ? WHERE id = ?", data)
    except:
        con.close()
        print('Error: No fue posible agregar la descripcion a la muestra de label studio')
        return()
    
    con.commit()
    con.close()
    print('Detalles de la Muestra agregados correctamente a label studio')

#------------------------------------------------------------------------------------------------------------------    


def editar_detallesMuestra_ls(id, descripcion):
    """
    Funcion para editar un nuevo registro en la tabla de project de label studio, 
    El nuevo registro se hara en base a cada muestra nueva que se haya agregado a la base de datos SIRMAT

    :param    id: id de la muestra que se usara para identificar el registro a actualizar
    :type     id: str
    :param title: titulo que se pondra en el campo 'title' del registro y sirve como el nombre del proyecto en label studio
    :type  title: str

    """

    # Se revisa primero si existe el archivo de la base de datos de label studio 
    # Este archivo lo genera automaticamente label studio cuando se inicia por primera vez

    
    if os.path.exists(str(DIR) + '/Label_Studio_Data/label_studio.sqlite3'):
         # Se crea conexion a base de datos
        try: 
            con = sqlite3.connect(str(DIR) + '/Label_Studio_Data/label_studio.sqlite3')
            cur = con.cursor()
        except:
            print('Error: No fue posible crear la conexion a la base de datos de label studio')
            return()
    else: 
        print('Error: No existe el archivo label_studio.sqlite3 dentro de Label_Studio_data')
        return()

    # Se guardan los datos nuevos en una sola variable
    new_data = (
        descripcion,
        id
    )

    # Se crea el SQL Query con el comando a ejecutar
    sql = ''' UPDATE project
              SET description= ?
              WHERE id = ?'''

    # Se intenta ejecutar el Query
    try: 
        cur.execute(sql, new_data)
    except:
        con.close()
        print('Error: No fue posible editar los detalles de la muestra de la base de datos de label studio')
        return()

    # Se guardan los cambios en la tabla
    con.commit()
    con.close()
    print('Detalles de la Muestra editados en label studio')
