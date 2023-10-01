'use strict';

// import { Request, Response } from 'express';
// import bugs from '../bugs';

const bugFunctions = module.exports

bugFunctions.get = async function (req, res) {
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

