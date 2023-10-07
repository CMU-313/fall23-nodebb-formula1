'use strict';

// import { Request, Response } from 'express';
// import bugs from '../bugs';

const bugFunctions = module.exports;

bugFunctions.get = async function (req, res) {
    res.render('bugs', {});
};
