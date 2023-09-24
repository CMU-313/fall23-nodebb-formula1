
'use strict';

const _ = require('lodash');

const db = require('../database');
const plugins = require('../plugins');
// const utils = require('../utils');
// const slugify = require('../slugify');
// const plugins = require('../plugins');
// const analytics = require('../analytics');
// const user = require('../user');
// const meta = require('../meta');
// const posts = require('../posts');
// const privileges = require('../privileges');
// const categories = require('../categories');
// const translator = require('../translator');


module.exports = function (Bugs) {
    Bugs.create = async function (data) {
        const timestamp = data.timestamp || Date.now();
        await db.incrObjectField('global', 'nextBid');

        const result = await plugins.hooks.fire('filter:bug.create', { bug: data, data: data });
        const bugData = result.bug;
        await db.setObject(`bug:${bugData.bid}`, bugData);

        const timestampedSortedSetKeys = [
            'bugs:bid',
        ];

        await Promise.all([
            db.sortedSetsAdd(timestampedSortedSetKeys, timestamp, bugData.bid),
            db.sortedSetsAdd('bugs:addressed', 0, 1),
        ]);

        plugins.hooks.fire('action:bug.save', { bug: _.clone(bugData), data: data });
        return bugData.bid;
    };

    Bugs.post = async function (data) {
        await Bugs.create(data);
        const bugData = data;

        plugins.hooks.fire('action:bug.post', { bug: bugData, data: data });

        return {
            bugData: bugData,
        };
    };
};
