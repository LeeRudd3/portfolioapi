const VenueController = require('./controllers/venue.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../../env.config');

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;

exports.routesConfig = function (app) {
    app.get('/venues', [
        VenueController.list
    ]);

    app.get('/venues/getpages', [
        VenueController.getPages
    ]);

    app.get('/venues/:venueId', [
        VenueController.getById
    ]);

    app.get('/getvenues/all', [
        VenueController.getAll
    ]);

    app.post('/venues', [
        VenueController.create
    ]);

    app.patch('/venues/:venueId', [
        VenueController.patchById
    ]);

    app.delete('/venues/:venueId', [
        VenueController.removeById
    ]);
    
    app.delete('/venues', [
        VenueController.removeByIds
    ]);

    app.get('/venues/search/:searchTerm', [
        VenueController.search
    ]);
};