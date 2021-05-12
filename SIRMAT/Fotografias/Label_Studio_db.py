import sqlite3
from pathlib import Path

DIR = Path(__file__).resolve().parent.parent


def agregar_foto_ls(id_foto, nombre_foto, id_usuario, id_proyecto):
    con = sqlite3.connect(str(DIR) + '\Label_Studio_data\label_studio.sqlite3')
    cur = con.cursor()

    data_import_fileupload = [
        (id_foto, 'upload/'+nombre_foto, id_usuario, id_proyecto)
    ]

    cur.executemany("insert into data_import_fileupload values (?, ?, ?, ?)", data_import_fileupload)
    
    data_task_ls = [
        (id_foto, '{"image": "/data/upload/'+ nombre_foto +'"}', '2021-05-06 01:35:46.100762','2021-05-06 01:35:46.100762', 0, id_proyecto, 1, id_foto,'{}')
    ]

    cur.executemany("insert into task values (?, ?, ?, ?, ?, ?, ?, ?, ?)", data_task_ls)
    con.commit()
    con.close()
    print(data_import_fileupload)
    print(data_task_ls)



##for row in cur.execute('SELECT * FROM data_import_fileupload'):
    ##print(row)