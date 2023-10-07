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
module.exports = function (Topics) {
    Topics.getUngroupedTopics = function (uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                uid: uid,
            };
            const data = yield Topics.getSortedTopics(params);
            const topics = yield Topics.getTopics(data.tids, params);
            const ungroupedTopics = topics.filter(topic => !topic.group || topic.group === '');
            data.topics = ungroupedTopics;
            return data;
        });
    };
    Topics.getGroupedTopics = function (groupName, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                uid: uid,
            };
            const data = yield Topics.getSortedTopics(params);
            const topics = yield Topics.getTopics(data.tids, params);
            const ungroupedTopics = topics.filter(topic => topic.group && topic.group === groupName);
            data.topics = ungroupedTopics;
            return data;
        });
    };
    Topics.assignTopicToGroup = function (tid, groupName) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(groupName);
            yield Topics.setTopicFields(tid, {
                group: groupName,
            });
        });
    };
};
