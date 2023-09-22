import validator from 'validator';
import nconf from 'nconf';
import db from '../database';
import plugins from '../plugins';
import utils from '../utils';
import translator from '../translator';

const intFields: string[] = [
    'createtime', 'memberCount', 'hidden', 'system', 'private',
    'userTitleEnabled', 'disableJoinRequests', 'disableLeave',
];

interface GroupsInterface {
        getGroupsFields: any;
        getGroupsData: any;
        getGroupField: any;
        getGroupFields: any;
        getGroupData: any;
        setGroupField: any;
        ephemeralGroups:any;
        getEphemeralGroup:any;
        create:any;
}

interface GroupInterface {
        userTitleEnabled: any;
        labelColor: any;
        textColor: any;
        icon: any;
        createtimeISO: any; 
        private: any; 
        memberPostCids: any; 
        memberPostCidsArray: any; 
        createtime: any;
        name: any;
        nameEncoded: any;
        displayName: any;
        description: any;
        userTitle: any;
        userTitleEscaped: any;
}
    

export = function (Groups:GroupsInterface) {
    Groups.getGroupsFields = async function (groupNames: string[], fields: string[]): Promise<any[]> {
        if (!Array.isArray(groupNames) || !groupNames.length) {
            return [];
        }

        const ephemeralIdx: number[] = groupNames.reduce((memo: number[], cur: string, idx: number) => {
            if (Groups.ephemeralGroups.includes(cur)) {
                memo.push(idx);
            }
            return memo;
        }, []);

        const keys: string[] = groupNames.map(groupName => `group:${groupName}`);
        const groupData: any[] = await db.getObjects(keys, fields);
        if (ephemeralIdx.length) {
            ephemeralIdx.forEach((idx: number) => {
                groupData[idx] = Groups.getEphemeralGroup(groupNames[idx]);
            });
        }

        groupData.forEach(group => modifyGroup(group, fields));

        const results = await plugins.hooks.fire('filter:groups.get', { groups: groupData });
        return results.groups;
    };

    Groups.getGroupsData = async function (groupNames: string[]): Promise<any[]> {
        return await Groups.getGroupsFields(groupNames, []);
    };

    Groups.getGroupData = async function (groupName: string): Promise<any | null> {
        const groupsData: any[] = await Groups.getGroupsData([groupName]);
        return Array.isArray(groupsData) && groupsData[0] ? groupsData[0] : null;
    };

    Groups.getGroupField = async function (groupName: string, field: string): Promise<any | null> {
        const groupData: any | null = await Groups.getGroupFields(groupName, [field]);
        return groupData ? groupData[field] : null;
    };

    Groups.getGroupFields = async function (groupName: string, fields: string[]): Promise<any | null> {
        const groups: any | null = await Groups.getGroupsFields([groupName], fields);
        return groups ? groups[0] : null;
    };

    Groups.setGroupField = async function (groupName: string, field: string, value: any): Promise<void> {
        await db.setObjectField(`group:${groupName}`, field, value);
        plugins.hooks.fire('action:group.set', { field: field, value: value, type: 'set' });
    };
}

function modifyGroup(group: GroupInterface, fields: string[]): void {
    if (group) {
        db.parseIntFields(group, intFields, fields);

        escapeGroupData(group);
        group.userTitleEnabled = ([null, undefined].includes(group.userTitleEnabled)) ? 1 : group.userTitleEnabled;
        group.labelColor = validator.escape(String(group.labelColor || '#000000'));
        group.textColor = validator.escape(String(group.textColor || '#ffffff'));
        group.icon = validator.escape(String(group.icon || ''));
        group.createtimeISO = utils.toISOString(group.createtime);
        group.private = ([null, undefined].includes(group.private)) ? 1 : group.private;
        group.memberPostCids = group.memberPostCids || '';
        group.memberPostCidsArray = group.memberPostCids.split(',').map(cid => parseInt(cid, 10)).filter(Boolean);

        group['cover:thumb:url'] = group['cover:thumb:url'] || group['cover:url'];

        if (group['cover:url']) {
            group['cover:url'] = group['cover:url'].startsWith('http') ? group['cover:url'] : (nconf.get('relative_path') + group['cover:url']);
        } else {
            group['cover:url'] = require('../coverPhoto').getDefaultGroupCover(group.name);
        }

        if (group['cover:thumb:url']) {
            group['cover:thumb:url'] = group['cover:thumb:url'].startsWith('http') ? group['cover:thumb:url'] : (nconf.get('relative_path') + group['cover:thumb:url']);
        } else {
            group['cover:thumb:url'] = require('../coverPhoto').getDefaultGroupCover(group.name);
        }

        group['cover:position'] = validator.escape(String(group['cover:position'] || '50% 50%'));
    }
}

function escapeGroupData(group: GroupInterface): void {
    if (group) {
        group.nameEncoded = encodeURIComponent(group.name);
        group.displayName = validator.escape(String(group.name));
        group.description = validator.escape(String(group.description || ''));
        group.userTitle = validator.escape(String(group.userTitle || ''));
        group.userTitleEscaped = translator.escape(group.userTitle);
    }
}
