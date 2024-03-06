var express = require('express')
var api=express.Router();
var albumController = require('../controllers/album');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'uploads/album'});
var md_auth=require('../middlewares/autenticated');
;


api.get('/album',albumController.list);
api.get('/album/:id',[md_auth.Auth],albumController.listaid);
api.post('/album',[md_auth.Auth],albumController.save);
api.delete('/album/:id',[md_auth.Auth],albumController.delete);
api.put('/album/:id',[md_auth.Auth],albumController.update);
api.post('/album/:id',[md_auth.Auth,md_upload],albumController.uploadimage);
api.get('/album/file/:file',albumController.getimage);
api.delete('/album/file/:id',albumController.delimage);


module.exports = api;