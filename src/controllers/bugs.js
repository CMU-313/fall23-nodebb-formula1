/* eslint-disable no-unused-vars */

'use strict';

const bugController = module.exports;

bugController.get = async function (req, res) {
    res.render('bugs', {});
};
