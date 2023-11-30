const VenueModel = require('../model/venue.model');

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    VenueModel.list(limit, page).then((result) => {
        res.status(200).send(result);
    })
 };

exports.getById = (req, res) => {
    VenueModel.findById(req.params.venueId).then((result) => {
        res.status(200).send(result);
    });
};

exports.create = (req, res) => {
    VenueModel.createVenue(req.body)
        .then((result) => {
            res.status(200).send({message: result});
    });   
};

exports.patchById = (req, res) => {
    VenueModel.patchVenue(req.params.venueId, req.body)
        .then((result) => {
            console.log(result);
            res.status(200).send({message: result});
    });
};

exports.removeById = (req, res) => {
    VenueModel.removeById(req.params.venueId)
        .then((result)=>{
            res.status(204).send({});
    });
};

exports.removeByIds = (req, res) => {
    VenueModel.removeByIds(req.body.ids)
        .then((result)=>{
            res.status(204).send({});
    });
};

exports.search = (req, res) => {
    VenueModel.search(req.params.searchTerm)
        .then((result)=>{
            res.status(200).send(result);
    });
};