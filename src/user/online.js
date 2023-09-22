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
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("../database");
const topics = require("../topics");
const plugins = require("../plugins");
const meta = require("../meta");
module.exports = function (User) {
    User.updateLastOnlineTime = function (uid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(parseInt(uid, 10) > 0)) {
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            const userData = yield db.getObjectFields(`user:${uid}`, ['status', 'lastonline']);
            const now = Date.now();
            if (userData.status === 'offline' || now - parseInt(userData.lastonline, 10) < 300000) {
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            yield User.setUserField(uid, 'lastonline', now);
        });
    };
    User.updateOnlineUsers = function (uid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(parseInt(uid, 10) > 0)) {
                return;
            }
            const now = Date.now();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            const userOnlineTime = yield db.sortedSetScore('users:online', uid);
            if (now - parseInt(userOnlineTime, 10) < 300000) {
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            yield db.sortedSetAdd('users:online', now, uid);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            topics.pushUnreadCount(uid);
            yield plugins.hooks.fire('action:user.online', { uid: uid, timestamp: now });
        });
    };
    User.isOnline = function (uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            const isArray = Array.isArray(uid);
            uid = (isArray ? uid : [uid]);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            const lastonline = yield db.sortedSetScores('users:online', uid);
            const isOnline = uid.map(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (_uid, index) => (now - lastonline[index]) < (meta.config.onlineCutoff * 60000));
            return isArray ? isOnline : isOnline[0];
        });
    };
};
