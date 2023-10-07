'use strict';

const bugs = require("../bugs");
const bodyParser = require('body-parser');
const plugins = require('../plugins');
const db = require('../database');
const _ = require('lodash');

// import { Request, Response } from 'express';
// import bugs from '../bugs';

const bugFunctions = module.exports

bugFunctions.get = async function (req, res) {
    res.render('bugs', {});
};

bugFunctions.submit = async function (req, res) {
    const hello = 'data';
    console.log(hello);
    console.log("body", req.body)
    console.log("file", req.file);
    console.log("params", req.params)
    
    const data = {
        title: 'Bug default Title second',
        description: 'Bug default description hello',
        // timestamp: '2022 09 24',
        resolved: false,
    };

    bugs.post(data);
    console.log("done");

    
    res.render('bugs', {});
}


// export const list = async function (req, res) {
//     const bugData = await Promise.all(bugs.getBugFields([1, 2], ['title', 'description', 'resolved']))
    
//     res.render('bugs/list', {
//         bugs: bugData,
//         title: '[[pages:bugs]]',
//         breadcrumbs: helpers.buildBreadcrumbs([{ text: '[[pages:bugs]]' }]),
//     });
// };

