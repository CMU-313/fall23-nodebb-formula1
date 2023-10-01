import validator from 'validator';
import nconf from 'nconf';
import { Request, Response, NextFunction } from 'express';

import meta from '../meta';
import groups from '../groups';
import user from '../user';
import helpers from './helpers';
import pagination from '../pagination';
import privileges from '../privileges';
import { GroupFullObject, PostObject, UserObjectSlim } from '../types';

interface GroupsRequest extends Request {
  uid: string;
}
const relative_path: string = nconf.get('relative_path') as string;

export const list = async function (req: GroupsRequest, res: Response) {
    const sort = req.query.sort || 'alpha';

    const [groupsData, allowGroupCreation]: [GroupFullObject[], boolean] = await Promise.all([
        groups.getGroupsBySort(sort, 0, 14) as Promise<GroupFullObject[]>,
        privileges.global.can('group:create', req.uid) as Promise<boolean>,
    ]);

    // get GroupObject with the current online user count (onlineUserCount property)
    async function withOnineUserCount(groupData: GroupFullObject): Promise<GroupFullObject> {
        return {
            ...groupData,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            onlineUserCount: await user.getGroupOnlineCount(groupData.name) as number,
        };
    }

    // Get online group count for all groups
    const groupsDataWithOnineUserCount = await Promise.all(
        groupsData.map(withOnineUserCount)
    );

    res.render('groups/list', {
        groups: groupsDataWithOnineUserCount,
        allowGroupCreation: allowGroupCreation,
        nextStart: 15,
        title: '[[pages:groups]]',
        breadcrumbs: helpers.buildBreadcrumbs([{ text: '[[pages:groups]]' }]),
    });
};

export const details = async function (req: GroupsRequest, res: Response, next: NextFunction) {
    const lowercaseSlug = req.params.slug.toLowerCase();
    if (req.params.slug !== lowercaseSlug) {
        if (res.locals.isAPI) {
            req.params.slug = lowercaseSlug;
        } else {
            return res.redirect(`${relative_path}/groups/${lowercaseSlug}`);
        }
    }
    const groupName = await groups.getGroupNameByGroupSlug(req.params.slug) as string;
    if (!groupName) {
        return next();
    }
    const [exists, isHidden, isAdmin, isGlobalMod] = await Promise.all([
        groups.exists(groupName),
        groups.isHidden(groupName),
        user.isAdministrator(req.uid),
        user.isGlobalModerator(req.uid),
    ] as Promise<boolean>[]);
    if (!exists) {
        return next();
    }
    if (isHidden && !isAdmin && !isGlobalMod) {
        const [isMember, isInvited] = await Promise.all([
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            groups.isMember(req.uid, groupName),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            groups.isInvited(req.uid, groupName),
        ] as Promise<boolean>[]);
        if (!isMember && !isInvited) {
            return next();
        }
    }
    const [groupData, posts] = await Promise.all([
        groups.get(groupName, {
            uid: req.uid,
            truncateUserList: true,
            userListCount: 20,
        }),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        groups.getLatestMemberPosts(groupName, 10, req.uid),
    ] as [Promise<GroupFullObject>, Promise<PostObject[]>]);

    if (!groupData) {
        return next();
    }
    groupData.isOwner = groupData.isOwner || isAdmin || (isGlobalMod && !groupData.system);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    groupData.onlineUserCount = await user.getGroupOnlineCount(groupData.name) as number;

    res.render('groups/details', {
        title: `[[pages:group, ${groupData.displayName}]]`,
        group: groupData,
        posts: posts.filter(post => post.isMainPost),
        isAdmin: isAdmin,
        isGlobalMod: isGlobalMod,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        allowPrivateGroups: meta.config.allowPrivateGroups as boolean,
        breadcrumbs: helpers.buildBreadcrumbs([{ text: '[[pages:groups]]', url: '/groups' }, { text: groupData.displayName }]),
    });
};

export const members = async function (
    req: GroupsRequest, res: Response & { query: {page: string }}, next: NextFunction
) {
    const page = parseInt(req.query.page as string, 10) || 1;
    const usersPerPage = 50;
    const start = Math.max(0, (page - 1) * usersPerPage);
    const stop = start + usersPerPage - 1;
    const groupName = await groups.getGroupNameByGroupSlug(req.params.slug) as string;
    if (!groupName) {
        return next();
    }
    const [groupData, isAdminOrGlobalMod, isMember, isHidden] = await Promise.all([
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        groups.getGroupData(groupName),
        user.isAdminOrGlobalMod(req.uid),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        groups.isMember(req.uid, groupName),
        groups.isHidden(groupName),
    ] as [Promise<GroupFullObject>, ...Promise<boolean>[]]);

    if (isHidden && !isMember && !isAdminOrGlobalMod) {
        return next();
    }
    const users = await user.getUsersFromSet(`group:${groupName}:members`, req.uid, start, stop) as UserObjectSlim[];

    const breadcrumbs = helpers.buildBreadcrumbs([
        { text: '[[pages:groups]]', url: '/groups' },
        { text: validator.escape(String(groupName)), url: `/groups/${req.params.slug}` },
        { text: '[[groups:details.members]]' },
    ]);

    const pageCount = Math.max(1, Math.ceil(groupData.memberCount / usersPerPage));
    res.render('groups/members', {
        users: users,
        pagination: pagination.create(page, pageCount, req.query),
        breadcrumbs: breadcrumbs,
    });
};

