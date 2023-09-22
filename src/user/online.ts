import db = require('../database');
import topics = require('../topics');
import plugins = require('../plugins');
import meta = require('../meta');

interface userDataTemplate {
    status: string;
    lastonline: string;
}

interface UserTemplate {
    uid: string;
    updateLastOnlineTime?: any;
    setUserField?: any;
    updateOnlineUsers?: any;
    isOnline?: any;
}

const User: UserTemplate = {
    uid: '',
};

module.exports = function (User: UserTemplate) {
    User.updateLastOnlineTime = async function (uid: string) {
        if (!(parseInt(uid, 10) > 0)) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const userData: userDataTemplate = await db.getObjectFields(`user:${uid}`, ['status', 'lastonline']) as userDataTemplate;
        const now = Date.now();
        if (userData.status === 'offline' || now - parseInt(userData.lastonline, 10) < 300000) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await User.setUserField(uid, 'lastonline', now);
    };

    User.updateOnlineUsers = async function (uid: string) {
        if (!(parseInt(uid, 10) > 0)) {
            return;
        }
        const now = Date.now();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const userOnlineTime: string = await db.sortedSetScore('users:online', uid) as string;
        if (now - parseInt(userOnlineTime, 10) < 300000) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        await db.sortedSetAdd('users:online', now, uid);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        topics.pushUnreadCount(uid);
        await plugins.hooks.fire('action:user.online', { uid: uid, timestamp: now });
    };

    User.isOnline = async function (uid: any) {
        const now = Date.now();
        const isArray = Array.isArray(uid);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        uid = isArray ? uid : [uid];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const lastonline : [] = await db.sortedSetScores('users:online', uid) as [];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, max-len
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
        const isOnline : any = uid.map((_uid, index) => (now - lastonline[index]) < (meta.config.onlineCutoff * 60000));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return isArray ? isOnline : isOnline[0];
    };
};
