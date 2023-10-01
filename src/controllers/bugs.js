/* eslint-disable no-unused-vars */

'use strict';

// import { Request, Response } from 'express';
// import bugs from '../bugs';
const bugs = require('../bugs');

const bugController = module.exports;

bugController.get = async function (req, res) {
    res.render('bugs', {});
};



// export const list = async function (req, res) {
//     const bugData = await Promise.all(bugs.getBugFields([1, 2], ['title', 'description', 'resolved']))

//     res.render('bugs/list', {
//         bugs: bugData,
//         title: '[[pages:bugs]]',
//         breadcrumbs: helpers.buildBreadcrumbs([{ text: '[[pages:bugs]]' }]),
//     });
// };

