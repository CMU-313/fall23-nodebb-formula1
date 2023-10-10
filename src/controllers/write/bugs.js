'use strict';

const bugController = module.exports;
const bugCreate = require('../../bugs');

bugController.submitData = async function (req, res) {
    console.log('request', req.body);
    bugCreate.post(req.body);
    res.render('successful submit', req);
};
