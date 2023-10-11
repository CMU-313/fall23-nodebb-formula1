'use strict';

const bugsController = module.exports;
const bugCreate = require('../../bugs');
const helpers = require('../helpers');

bugsController.submitData = async function (req, res) {
    bugCreate.post(req.body);
    helpers.formatApiResponse(200, res);
};
