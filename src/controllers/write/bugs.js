"use strict";

const bugsController = module.exports;
const bugsCreate = require("../../bugs");
const helpers = require("../helpers");

bugsController.submitData = async function (req, res) {
    const data = await bugsCreate.post(req.body);
    helpers.formatApiResponse(200, res, data.bugData);
};
