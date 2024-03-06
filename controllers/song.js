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
        
        data = req.body;
        console.log(data)
        name= data.name
        number = data.number
        duration = data.duration
        file = data.file
        albums_id = data.albums_id
        var sql = 'INSERT INTO songs (name,number,duration,file,albums_id) VALUES ("'+name+'","'+number+'","'+duration+'","'+file+'","'+albums_id+'")';
        conexion.query(sql, data, function(err,results,fields){
            if(err){
                console.log(err);
            }else{
                console.log(results);
                res.status(200).send({message: "Canción agregada correctamente."})
            }
            console.log(err)
        })
        
    },
    
    list(req,res){
        conexion.query(
            'SELECT * FROM songs',
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
            'SELECT * FROM songs where  id=?',[req.params.id], 
            function (err, results, fields){
                if(results){
                    res.status(200).send({results})
                }else{
                    res.status(500).send({message:'Error: intentalo más tarde'})
                }
            }
        );
    },
    
    delete(req, res) {
        const id = req.params.id;
        const user = req.user;
        let sql = '';
    
        if (user.role == 'admin' || user.role == 'creator') {
            sql = 'DELETE from songs WHERE id = ' + id;
            conexion.query(sql, function(err, results, fields) {
                if (!err) {
                    if (results.affectedRows != 0) {
                        res.status(200).send({ message: "Registro eliminado" });
                    } else {
                        res.status(200).send({ message: "No se eliminó nada" });
                    }
                } else {
                    console.log(err);
                    res.status(500).send({ message: "Inténtalo más tarde" });
                }
            });
        } else {
            res.status(403).send({ message: "No estás autorizado para eliminar esta canción" });
        }
    },
    
    update(req, res) {
        console.log(req.body);
        const id = req.params.id;
        const data = req.body;
        
        const sql = 'UPDATE songs SET ? WHERE id=?';
    
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
                conexion.query('UPDATE songs SET image="'+file_name+'" WHERE id='+id,
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
    uploadsong(req, res) {
        var id = req.params.id;
        var file = 'Sin video..';
        
        if (req.files) {
            var file_path = req.files.file.path; //linea 134
            var file_split = file_path.split('\\'); //cambiar en linux por \/
            var file_name = file_split[2];
            var ext = file_name.split('.');
            var file_ext = ext[1].toLowerCase();  
            if (['mov', 'avi', 'mp3'].includes(file_ext)) {
                conexion.query('UPDATE songs SET file="'+file_name+'" WHERE id = '+id,
                function(err, results, fields){
                    if (!err) {
                        console.log(err);
                        if (results.affectedRows != 0) {
                            res.status(200).send({message: 'Canción actualizada'});
                        } else {
                            console.log()
                            res.status(200).send({message: 'Error al actualizar'});
                        }
                    } else {
                        console.log(err);
                        res.status(200).send({message: 'Inténtelo más tarde'});
                    }
                });
            } else {
                res.status(400).send({message: 'Formato de canción no válido'});
            }
        } else {
            res.status(400).send({message: 'No se proporcionó ningún archivo'});
        }
    },
    getsong(req,res){
        var file=req.params.file;
        var path_file='./uploads/song/'+file;
        console.log(path_file)
        if(fs.existsSync(path_file)){
            res.sendfile(path.resolve(path_file))
        }else{
            res.status(404).send({message: 'no existe el archivo'})
        }
    },
    delsong(req,res){
        id = req.params.id;
        var sql = "select file from song WHERE id="+id;
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