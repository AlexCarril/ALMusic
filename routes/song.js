var express = require('express')
var api=express.Router();
var songController = require('../controllers/song');
var multipart = require('connect-multiparty');
var md_upload=multipart({uploadDir:'uploads/song'});
var md_auth=require('../middlewares/autenticated');

api.get('/song',songController.list);
api.get('/song/:id',[md_auth.Auth],songController.listaid);
api.post('/song',[md_auth.Auth],songController.save);
api.delete('/song/:id',[md_auth.Auth],songController.delete);
api.put('/song/:id',[md_auth.Auth],songController.update);
api.post('/song/:id',[md_auth.Auth,md_upload],songController.uploadsong);
api.post('/song/:id',[md_auth.Auth,md_upload],songController.uploadimage);
api.get('/song/file/:file',songController.getsong);
api.delete('/song/file/:id',songController.delsong);



module.exports = api;