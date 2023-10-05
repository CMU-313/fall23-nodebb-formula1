// eslint-disable-next-line import/no-import-module-exports
import { TopicObject } from '../types';

interface TopicsI {
  getUngroupedTopics: (uid: string) => Promise<Data>;
  getSortedTopics: (params: Params) => Promise<Data>;
  getTopics: (tids: string[], params: Params) => Promise<TopicObject[]>;
  assignTopicToGroup: (tid: string, groupName: string) => Promise<void>;
  setTopicFields: (tid: string, data: {[key: string]: string}) => Promise<void>;
}

interface Params {
    term?: string;
    sort?: string;
    query?: string;
    cids?: string[] | string;
    tags?: string[];
    uid?: string;
}

interface Data {
    tids: string[];
    nextStart: number;
    topicsCount: number;
    topics: TopicObject[];
}


module.exports = function (Topics: TopicsI) {
    Topics.getUngroupedTopics = async function (uid) {
        const params = {
            uid: uid,
        };
        const data = await Topics.getSortedTopics(params);
        const topics = await Topics.getTopics(data.tids, params);
        const ungroupedTopics = topics.filter(topic => !topic.group || topic.group === '');
        data.topics = ungroupedTopics;
        return data;
    };

    Topics.assignTopicToGroup = async function (tid, groupName) {
        console.log(groupName);
        await Topics.setTopicFields(tid, {
            group: groupName,
        });
    };
};
