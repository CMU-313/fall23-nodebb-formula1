'use strict';

const router = require('express').Router();
const middleware = require('../../middleware');
const controllers = require('../../controllers');
const routeHelpers = require('../helpers');

const { setupApiRoute } = routeHelpers;

module.exports = function () {
    // const middlewares = [middleware.ensureLoggedIn];

    // const multipart = require('connect-multiparty');
    // const multipartMiddleware = multipart();

    setupApiRoute(router, 'post', '/', [middleware.checkRequired.bind(null, ['name', 'email', 'description'])], controllers.write.bugs.submitData);
    return router;
};
