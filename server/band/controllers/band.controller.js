const BandModel = require('../model/band.model');

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    BandModel.list(limit, page).then((result) => {
        res.status(200).send(result);
    })
 };

exports.getById = (req, res) => {
    BandModel.findById(req.params.bandId).then((result) => {
        res.status(200).send(result);
    });
};

exports.create = (req, res) => {
    BandModel.createBand(req.body)
        .then((result) => {
            res.status(201).send(result);
    });   
};

exports.patchById = (req, res) => {
    BandModel.patchUser(req.params.bandId, req.body).then((result) => {
            res.status(204).send(result);
    });
};

exports.removeById = (req, res) => {
    BandModel.removeById(req.params.bandId)
        .then((result)=>{
            res.status(204).send({});
    });
};