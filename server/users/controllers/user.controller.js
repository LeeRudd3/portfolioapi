const UserModel = require('../model/user.model');
const crypto = require('crypto');

exports.create = (req, res) => {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(atob(req.body.password)).digest("base64");
    req.body.password = salt + "$" + hash;
    req.body.permissionLevel = 2057;
    
    UserModel.createUser(req.body)
        .then((result) => {
            res.status(201).send({id: result});
    });   
};

exports.getById = (req, res) => {
    UserModel.findById(req.params.userId).then((result) => {
        res.status(200).send(result);
    });
};

exports.getByEmail = (req, res) => {
    UserModel.findByEmail(req.params.email).then((result) => {
        res.status(200).send(result);
    });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    UserModel.list(limit, page).then((result) => {
        res.status(200).send(result);
    })
 };

exports.patchById = (req, res) => {
    if (req.body.password){
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(atob(req.body.password)).digest("base64");
        req.body.password = salt + "$" + hash;
    }
    UserModel.patchUser(req.params.userId, req.body).then((result) => {
            res.status(204).send(result);
    });
 };

 exports.removeById = (req, res) => {
    UserModel.removeById(req.params.userId)
        .then((result)=>{
            res.status(204).send({});
        });
 };

 exports.removeByEmail = (req, res) => {
    UserModel.removeByEmail(req.params.userEmail)
        .then((result)=>{
            res.status(204).send({});
        });
 };