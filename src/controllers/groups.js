"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.members = exports.details = exports.list = void 0;
const validator_1 = __importDefault(require("validator"));
const nconf_1 = __importDefault(require("nconf"));
const meta_1 = __importDefault(require("../meta"));
const groups_1 = __importDefault(require("../groups"));
const user_1 = __importDefault(require("../user"));
const helpers_1 = __importDefault(require("./helpers"));
const pagination_1 = __importDefault(require("../pagination"));
const privileges_1 = __importDefault(require("../privileges"));
const relative_path = nconf_1.default.get('relative_path');
const list = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sort = req.query.sort || 'alpha';
        const [groupsData, allowGroupCreation] = yield Promise.all([
            groups_1.default.getGroupsBySort(sort, 0, 14),
            privileges_1.default.global.can('group:create', req.uid),
        ]);
        // get GroupObject with the current online user count (onlineUserCount property)
        function withOnineUserCount(groupData) {
            return __awaiter(this, void 0, void 0, function* () {
                return Object.assign(Object.assign({}, groupData), { 
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    onlineUserCount: yield user_1.default.getGroupOnlineCount(groupData.name) });
            });
        }
        // Get online group count for all groups
        const groupsDataWithOnineUserCount = yield Promise.all(groupsData.map(withOnineUserCount));
        res.render('groups/list', {
            groups: groupsDataWithOnineUserCount,
            allowGroupCreation: allowGroupCreation,
            nextStart: 15,
            title: '[[pages:groups]]',
            breadcrumbs: helpers_1.default.buildBreadcrumbs([{ text: '[[pages:groups]]' }]),
        });
    });
};
exports.list = list;
const details = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const lowercaseSlug = req.params.slug.toLowerCase();
        if (req.params.slug !== lowercaseSlug) {
            if (res.locals.isAPI) {
                req.params.slug = lowercaseSlug;
            }
            else {
                return res.redirect(`${relative_path}/groups/${lowercaseSlug}`);
            }
        }
        const groupName = yield groups_1.default.getGroupNameByGroupSlug(req.params.slug);
        if (!groupName) {
            return next();
        }
        const [exists, isHidden, isAdmin, isGlobalMod] = yield Promise.all([
            groups_1.default.exists(groupName),
            groups_1.default.isHidden(groupName),
            user_1.default.isAdministrator(req.uid),
            user_1.default.isGlobalModerator(req.uid),
        ]);
        if (!exists) {
            return next();
        }
        if (isHidden && !isAdmin && !isGlobalMod) {
            const [isMember, isInvited] = yield Promise.all([
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                groups_1.default.isMember(req.uid, groupName),
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                groups_1.default.isInvited(req.uid, groupName),
            ]);
            if (!isMember && !isInvited) {
                return next();
            }
        }
        const [groupData, posts] = yield Promise.all([
            groups_1.default.get(groupName, {
                uid: req.uid,
                truncateUserList: true,
                userListCount: 20,
            }),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            groups_1.default.getLatestMemberPosts(groupName, 10, req.uid),
        ]);
        if (!groupData) {
            return next();
        }
        groupData.isOwner = groupData.isOwner || isAdmin || (isGlobalMod && !groupData.system);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        groupData.onlineUserCount = (yield user_1.default.getGroupOnlineCount(groupData.name));
        res.render('groups/details', {
            title: `[[pages:group, ${groupData.displayName}]]`,
            group: groupData,
            posts: posts.filter(post => post.isMainPost),
            isAdmin: isAdmin,
            isGlobalMod: isGlobalMod,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            allowPrivateGroups: meta_1.default.config.allowPrivateGroups,
            breadcrumbs: helpers_1.default.buildBreadcrumbs([{ text: '[[pages:groups]]', url: '/groups' }, { text: groupData.displayName }]),
        });
    });
};
exports.details = details;
const members = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = parseInt(req.query.page, 10) || 1;
        const usersPerPage = 50;
        const start = Math.max(0, (page - 1) * usersPerPage);
        const stop = start + usersPerPage - 1;
        const groupName = yield groups_1.default.getGroupNameByGroupSlug(req.params.slug);
        if (!groupName) {
            return next();
        }
        const [groupData, isAdminOrGlobalMod, isMember, isHidden] = yield Promise.all([
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            groups_1.default.getGroupData(groupName),
            user_1.default.isAdminOrGlobalMod(req.uid),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            groups_1.default.isMember(req.uid, groupName),
            groups_1.default.isHidden(groupName),
        ]);
        if (isHidden && !isMember && !isAdminOrGlobalMod) {
            return next();
        }
        const users = yield user_1.default.getUsersFromSet(`group:${groupName}:members`, req.uid, start, stop);
        const breadcrumbs = helpers_1.default.buildBreadcrumbs([
            { text: '[[pages:groups]]', url: '/groups' },
            { text: validator_1.default.escape(String(groupName)), url: `/groups/${req.params.slug}` },
            { text: '[[groups:details.members]]' },
        ]);
        const pageCount = Math.max(1, Math.ceil(groupData.memberCount / usersPerPage));
        res.render('groups/members', {
            users: users,
            pagination: pagination_1.default.create(page, pageCount, req.query),
            breadcrumbs: breadcrumbs,
        });
    });
};
exports.members = members;
