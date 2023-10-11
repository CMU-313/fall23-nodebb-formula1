'use strict';

const bugController = module.exports;
const bugCreate = require('../../bugs');
const helpers = require('../helpers');

bugController.submitData = async function (req, res) {
    bugCreate.post(req.body);
    helpers.formatApiResponse(200, res);
};
