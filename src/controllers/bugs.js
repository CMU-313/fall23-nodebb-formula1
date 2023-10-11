/* eslint-disable no-unused-vars */

'use strict';

// import { Request, Response } from 'express';
// import bugs from '../bugs';
const bugs = require('../bugs');

const bugController = module.exports;

bugController.get = async function (req, res) {
    res.render('bugs', {});
};
