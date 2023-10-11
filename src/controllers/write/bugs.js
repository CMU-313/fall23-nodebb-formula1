'use strict';

const bugsController = module.exports;
const bugsCreate = require('../../bugs');
const helpers = require('../helpers');

bugsController.submitData = async function (req, res) {
    console.log('data', req.body)
    const data = await bugsCreate.post(req.body);
    console.log()
    helpers.formatApiResponse(200, res, data.bugData);
};
