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
const database_1 = __importDefault(require("../database"));
const privileges_1 = __importDefault(require("../privileges"));
const _1 = __importDefault(require("."));
const posts_1 = __importDefault(require("../posts"));
const topics_1 = __importDefault(require("../topics"));
module.exports = function (Groups) {
    function truncateMemberPosts(groupName) {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            const pids = yield database_1.default.getSortedSetRevRange(`group:${groupName}:member:pids`, 10, 10);
            const lastPid = pids[0];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            const score = yield database_1.default.sortedSetScore(`group:${groupName}:member:pids`, lastPid);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            yield database_1.default.sortedSetsRemoveRangeByScore([`group:${groupName}:member:pids`], '-inf', score);
        });
    }
    Groups.onNewPostMade = function (postData) {
        return __awaiter(this, void 0, void 0, function* () {
            const allgroupNames = yield Groups.getUserGroupMembership('groups:visible:createtime', [postData.uid]);
            let groupNames = allgroupNames[0];
            // Only process those groups that have the cid in its memberPostCids setting (or no setting at all)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            const groupData = yield _1.default.getGroupsFields(groupNames, ['memberPostCids']);
            groupNames = groupNames.filter((_, idx) => (!groupData[idx].memberPostCidsArray.length ||
                groupData[idx].memberPostCidsArray.includes(postData.cid)));
            const keys = groupNames.map(groupName => `group:${groupName}:member:pids`);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            yield database_1.default.sortedSetsAdd(keys, postData.timestamp, postData.pid);
            yield Promise.all(groupNames.map(name => truncateMemberPosts(name)));
        });
    };
    /**
     * Fetches all main/topic 'posts' that are assigned to a group
     * Function was modified to provide more useful data to user
     * @param groupName name of group
     * @param uid user id of current user
     * @returns array of posts
     */
    Groups.getLatestMemberPosts = function (groupName, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            let pids = yield database_1.default.getSortedSetRevRange('posts:pid', 0, -1); // Fetch all post ids
            pids = (yield privileges_1.default.posts.filter('topics:read', pids, uid)); // fiter for privilege and access
            const allposts = // Get all post summaries from pids
             
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            yield posts_1.default.getPostSummaryByPids(pids, uid, { stripTags: false });
            const mainPosts = allposts.filter(post => post.isMainPost); // Filter for topic posts
            const assignedGroupNames = yield Promise.all(// Compute all topics data for all main posts
            mainPosts.map(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            (post) => __awaiter(this, void 0, void 0, function* () { return yield topics_1.default.getTopicDataByPid(post.pid); })));
            // Filter all main posts that are assigned to the group
            const postsInGroup = mainPosts.filter((_, idx) => assignedGroupNames.at(idx).group === groupName);
            return postsInGroup;
        });
    };
};
