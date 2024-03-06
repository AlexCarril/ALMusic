const conn = require('mysql2');
var fs = require('fs');
var path = require('path');



const conexion = conn.createConnection({
    host:'localhost',
    user:'root',
    password:'mysql',
    database:'mydb'
});

module.exports={
    save(req,res){
        var data = req.body;
        
        title= data.title
        description = data.description
        year = data.year
        artist_id = data.artist_id
        var sql = 'INSERT INTO albums (title, description, year, artist_id) VALUES ("'+title+'","'+description+'","'+year+'","'+artist_id+'")';
        conexion.query(sql, data, function(err,results,fields){
            if(err){
                console.log(err);
                res.status(404).send({message: "No se pudo agregar"})

            }else{
                console.log(results);
                res.status(200).send({message: "Álbum agregado correctamente."})
            }
            console.log(results)
        })
        
    },
    list(req,res){
        conexion.query(
            'SELECT * FROM albums',
            function (err, results, fields){
                if(results){
                    res.status(200).send({results})
                }else{
                    res.status(500).send({message:'Error: intentalo más tarde'})
                }
            }
        );
    },
    listaid(req,res){
        conexion.query(
            'SELECT * FROM albums where  id=?',[req.params.id], 
            function (err, results, fields){
                if(results){
                    res.status(200).send({results})
                }else{
                    res.status(500).send({message:'Error: intentalo más tarde'})
                }
            }
        );
    },
    update(req, res) {
        console.log(req.body);
        const id = req.params.id;
        const data = req.body;
        console.log(data);
        
        const sql = 'UPDATE albums SET ? WHERE id=?';
    
        conexion.query(sql, [data, id], function (err, results, fields) {
            if (!err) {
                if (results.affectedRows > 0) {
                    // La actualización fue exitosa
                    res.status(200).send({ message: 'Datos actualizados correctamente' });
                } else {
                    // No se encontró el registro con el ID proporcionado
                    res.status(404).send({ message: 'No se encontró el registro con el ID proporcionado' });
                }
            } else {
                // Ocurrió un error durante la consulta
                console.error(err);
                res.status(500).send({ message: 'Error interno del servidor' });
            }
        });
    },
    delete(req,res){
        id = req.params.id;
        conexion.query('DELETE FROM albums WHERE id = '+id,function(err,results,fields){
            if(!err){
                if(results.affectedRows!=0){
                    res.status(200).send({message:"Registro eliminado"})
                }else{
                    res.status(200).send({message: "No se elimino nada"})
                }
            }else{
                console.log(err);
                res.status(500).send({message:"Intentalo más tarde"})
            }
        })
    },

    uploadimage(req,res){
        var id = req.params.id;
        var file ='sin imagen...';
        console.log(req.files.image.path)
        if(req.files){
            var file_path = req.files.image.path;
            var file_split= file_path.split('\\');
            var file_name = file_split[2];
            var ext = file_name.split('\.');
            var file_ext = ext[1];
            if(file_ext=='jpg' || file_ext=='gif' || file_ext=='png' || file_ext=='jpeg'){
                conexion.query('UPDATE albums SET image="'+file_name+'" WHERE id='+id,
                function(err,results,fields){
                    if(!err){
                        if(results.affectedRows!=0){
                            res.status(200).send({message: 'imagen acualizado'})
                        }else{
                            res.status(200).send({message: 'error al actualizar'})
                        }
                    }else{
                        console.log(err);
                        res.status(200).send({message: 'imagen no valido'})
                    }
                    

                })

            }
        }
    },
   
    getimage(req,res){
        var file=req.params.file;
        var path_file='./uploads/album/'+file;
        console.log(path_file)
        if(fs.existsSync(path_file)){
            res.sendfile(path.resolve(path_file))
        }else{
            res.status(404).send({message: 'no existe el archivo'})
        }
    },
    delimage(req,res){
        id = req.params.id;
        var sql = "select file from albums WHERE id="+id;
        conexion.query(sql,function(err,results,fields){
            if(!err){
                if (results.length !=0) {
                    if(results[0].file != null) {
                        var path_file = './uploads/song/' +results[0].file;
                        try {
                            fs.unlinkSync(path_file);
                            res.status(200).send({message: "file eliminada"})
                        } catch (error) {
                            console.log(error)
                            res.status(200).send({message: "no se pudo eliminar, intenta mas tarde"})
                            
                        }
                    }else{
                        res.status(404).send({message: "no encontrada"})
                        
                    }
                } else{
                    res.status(404).send({message: "no encontrada"})
    
                }
            }
        })
    
    }
    
}