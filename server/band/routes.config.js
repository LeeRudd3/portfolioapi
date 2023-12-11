const BandController = require('./controllers/band.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../../env.config');

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;

exports.routesConfig = function (app) {
    app.get('/bands', [
        BandController.list
    ]);

    app.get('/bands/:bandId', [
        BandController.getById
    ]);

    app.post('/bands', [
        BandController.create
    ]);

    app.patch('/bands/:bandId', [
        BandController.patchById
    ]);

    app.delete('/bands/:bandId', [
        BandController.removeById
    ]);
};