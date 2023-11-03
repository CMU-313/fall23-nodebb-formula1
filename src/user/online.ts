import db = require('../database');
import topics = require('../topics');
import plugins = require('../plugins');
import meta = require('../meta');
import groups = require('../groups');

interface userDataTemplate {
    status: string;
    lastonline: string;
}

interface UserTemplate {
    uid: string;
    updateLastOnlineTime: (uid: string) => Promise<void>;
    setUserField: (uid: string, field: string, value: number | string) => Promise<void>;
    updateOnlineUsers: (uid: string) => Promise<void>;
    isOnline: (uid: string | string[]) => Promise<boolean | boolean[]>;
    getGroupOnlineCount: (groupName: string) => Promise<number>;
    getUidsFromSet: (set: string, start: number, stop: number) => Promise<string[]>;
}

module.exports = function (User: UserTemplate) {
    User.updateLastOnlineTime = async function (uid: string) {
        if (!(parseInt(uid, 10) > 0)) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const userData: userDataTemplate = (await db.getObjectFields(`user:${uid}`, ['status', 'lastonline'])) as userDataTemplate;
        const now = Date.now();
        if (userData.status === 'offline' || now - parseInt(userData.lastonline, 10) < 300000) {
            return;
        }
        await User.setUserField(uid, 'lastonline', now);
    };

    User.updateOnlineUsers = async function (uid: string) {
        if (!(parseInt(uid, 10) > 0)) {
            return;
        }
        const now = Date.now();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const userOnlineTime: string = (await db.sortedSetScore('users:online', uid)) as string;
        if (now - parseInt(userOnlineTime, 10) < 300000) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        await db.sortedSetAdd('users:online', now, uid);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        topics.pushUnreadCount(uid);
        await plugins.hooks.fire('action:user.online', { uid: uid, timestamp: now });
    };

    User.isOnline = async function (uid: string | string[]) {
        const now = Date.now();
        const isArray = Array.isArray(uid);
        uid = (isArray ? uid : [uid]) as string[];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const lastonline: [] = (await db.sortedSetScores('users:online', uid)) as [];
        const isOnline: boolean[] = uid.map(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (_uid, index) => now - lastonline[index] < meta.config.onlineCutoff * 60000
        );
        return isArray ? isOnline : isOnline[0];
    };

    /**
     * Get count of group members that are online
     * @param {string} groupName group name
     * @param {string} uid user id
     * @returns count of online users
     */
    User.getGroupOnlineCount = async function (groupName: string): Promise<number> {
        // Get list of uids of online users
        const onlineUids = await User.getUidsFromSet('users:online', 0, -1);

        // Get boolean array repesenting user membership in group
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const groupMemberMask = (await groups.isMembers(onlineUids, groupName)) as boolean[];

        // Filter online user that are members in group
        const numOnlineInGroup = groupMemberMask.reduce((count, isMember) => count + Number(isMember), 0);

        return numOnlineInGroup;
    };
};
