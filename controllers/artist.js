const conn = require('mysql2');

const conexion = conn.createConnection({
    host:'localhost',
    user:'root',
    password:'mysql',
    database:'mydb'
});

module.exports={
    save(req,res){
        data = req.body;
        name = data.name
        description = data.description
        year = data.year
        var sql = 'INSERT INTO artist (name, description,year) VALUES ("'+name+'","'+description+'","'+year+'")';
        conexion.query(sql, data, function(err,results,fields){
            if(err){
                console.log(err);
            }else{
                console.log(results);
                res.status(200).send({message: "Artista agregado correctamente."})
            }
            console.log(results)
        })
        
    },
    list(req,res){
        conexion.query(
            'SELECT * FROM artist',
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
            'SELECT * FROM artist where  id=?',[req.params.id], 
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
        
        const sql = 'UPDATE artist SET ? WHERE id=?';
    
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
        conexion.query('DELETE FROM artist WHERE id = '+id,function(err,results,fields){
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
    }
}