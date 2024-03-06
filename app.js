const express = require('express')
const app = express()
const logger = require('morgan')
const port = 3000
const conn = require('mysql2')
const bodyparser=require('body-parser');
const cors=require('cors');
const conexion = conn.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'mydb',
});

app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({extended:true}));
app.use(bodyparser.json());

//rutas de user
var user_routes=require('./routes/user');
app.use(user_routes);
//ruta de canciones
var song_routes=require('./routes/song');
app.use(song_routes);
//ruta de artistas
var artist_routes=require('./routes/artist');
app.use(artist_routes);
//ruta de albums
var album_routes=require('./routes/album');
app.use(album_routes);

app.get('*', (req, res) => {
    res.send({message:'ruta no valida!'})
})

conexion.connect((error)=>{
    if(error){
        console.log('no se puede conectar a la base de datos')
        }else{
            console.log('conectado a la base de datos')
        }
        app.listen(port, () => {
            console.log('servidor API ejecutado en el puerto ${port}')
        })
});
