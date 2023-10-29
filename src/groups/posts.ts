import db from '../database';
import privileges from '../privileges';
import groups from '.';
import posts from '../posts';
import topics from '../topics';
import { PostObject } from '../types/post';
import { GroupDataObject, TopicObject } from '../types';

interface GroupsInterface {
    onNewPostMade: (postData: { uid: number; cid: number; pid: number; timestamp: string }) => Promise<void>;
    getLatestMemberPosts: (groupName: string, max: number, uid: string) => Promise<PostObject[]>;
    getUserGroupMembership: (set: string, uids: number[]) => Promise<string[][]>;
}

export = function (Groups: GroupsInterface) {
    async function truncateMemberPosts(groupName: string) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const pids = (await db.getSortedSetRevRange(`group:${groupName}:member:pids`, 10, 10)) as number[];
        const lastPid = pids[0];

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const score = (await db.sortedSetScore(`group:${groupName}:member:pids`, lastPid)) as number;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        await db.sortedSetsRemoveRangeByScore([`group:${groupName}:member:pids`], '-inf', score);
    }

    Groups.onNewPostMade = async function (postData) {
        const allgroupNames = await Groups.getUserGroupMembership('groups:visible:createtime', [postData.uid]);
        let groupNames = allgroupNames[0];

        // Only process those groups that have the cid in its memberPostCids setting (or no setting at all)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const groupData = (await groups.getGroupsFields(groupNames, ['memberPostCids'])) as GroupDataObject[];

        groupNames = groupNames.filter((_, idx) => !groupData[idx].memberPostCidsArray.length || groupData[idx].memberPostCidsArray.includes(postData.cid));

        const keys = groupNames.map(groupName => `group:${groupName}:member:pids`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        await db.sortedSetsAdd(keys, postData.timestamp, postData.pid);
        await Promise.all(groupNames.map(name => truncateMemberPosts(name)));
    };

    /**
     * Fetches all main/topic 'posts' that are assigned to a group
     * Function was modified to provide more useful data to user
     * @param groupName name of group
     * @param uid user id of current user
     * @returns array of posts
     */
    Groups.getLatestMemberPosts = async function (groupName, uid) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        let pids = (await db.getSortedSetRevRange('posts:pid', 0, -1)) as number[]; // Fetch all post ids

        pids = (await privileges.posts.filter('topics:read', pids, uid)) as number[]; // fiter for privilege and access

        const allposts: PostObject[] = // Get all post summaries from pids
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            (await posts.getPostSummaryByPids(pids, uid, { stripTags: false })) as PostObject[];

        const mainPosts = allposts.filter(post => post.isMainPost); // Filter for topic posts

        const assignedGroupNames = await Promise.all(
            // Compute all topics data for all main posts
            mainPosts.map<Promise<TopicObject>>(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                async post => (await topics.getTopicDataByPid(post.pid)) as Promise<TopicObject>
            )
        );

        // Filter all main posts that are assigned to the group
        const postsInGroup = mainPosts.filter((_, idx) => assignedGroupNames.at(idx).group === groupName);
        return postsInGroup;
    };
};
