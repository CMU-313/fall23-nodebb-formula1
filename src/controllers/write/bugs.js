'use strict';

const bugController = module.exports;
const bugCreate = require('../../bugs');

bugController.submitData = async function (req, res) {
    bugCreate.post(req.body);
    console.log(req.body);
    res.render('Successful Bug Form Submit', req);
};
