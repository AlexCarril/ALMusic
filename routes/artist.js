var express = require('express')
var api = express.Router();
var md_auth=require('../middlewares/autenticated');
var userController = require('../controllers/artist');

api.get('/artist',userController.list);
api.post('/artist',userController.save);
api.delete('/artist/:id',[md_auth.Auth],userController.delete);
api.get('/artist/:id',[md_auth.Auth],userController.listaid);
api.put('/artist/:id',[md_auth.Auth],userController.update);


module.exports = api;