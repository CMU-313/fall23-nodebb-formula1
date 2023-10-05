
'use strict';

const nconf = require('nconf');

const helpers = require('./helpers');
// const recentController = require('./recent');
const Topics = require('../topics');
const Groups = require('../groups');

const ungroupedController = module.exports;

ungroupedController.get = async function (req, res, next) {
    const { uid } = req;
    const ungroupedTopicsData = await Topics.getUngroupedTopics(uid);
    const userGroupsData = (await Groups.getUserGroups([uid]))[0];

    if (!ungroupedTopicsData || !userGroupsData) {
        return next();
    }

    const data = {
        ...ungroupedTopicsData,
        groups: userGroupsData,
        uid: uid,
    };

    const term = helpers.terms[req.query.term] || 'alltime';
    if (req.originalUrl.startsWith(`${nconf.get('relative_path')}/api/ungrouped`) || req.originalUrl.startsWith(`${nconf.get('relative_path')}/ungouped`)) {
        data.title = `[[pages:ungouped-${term}]]`; // TODO define labels in Json
        const breadcrumbs = [{ text: '[[global:header.ungouped]]' }];
        data.breadcrumbs = helpers.buildBreadcrumbs(breadcrumbs);
    }

    res.render('ungrouped', data);
};
