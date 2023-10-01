const db = require('../database');
const plugins = require('../plugins');
const utils = require('../utils');

module.exports = function (Bugs) {
    Bugs.getBugFields = async function (bids, fields) {
        if (!Array.isArray(bids) || !bids.length) {
            return [];
        }
        const keys = bids.map(bid => `bug:${bid}`);
        const bugData = await db.getObjects(keys, fields);

        const result = await plugins.hooks.fire('filter:bids.getFields', {
            bids: bids,
            bugs: bugData,
            fields: fields,
        });
        return result.posts;
    }

    Bugs.getBugData = async function (bid) {
        const bugs = await Bugs.getBugsFields([bid], []);
        return bugs && bugs.length ? bugs[0] : null;
    };

    Bugs.getBugsData = async function (bids) {
        return await Bugs.getBugFields(bids, []);
    }

}
