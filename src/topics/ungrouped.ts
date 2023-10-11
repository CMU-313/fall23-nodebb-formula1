import { TopicObject } from '../types';

interface TopicsI {
  getUngroupedTopics: (uid: string) => Promise<TopicData>;
  getGroupedTopics: (group: string, uid: string) => Promise<TopicData>;
  getSortedTopics: (params: Params) => Promise<TopicData>;
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

interface TopicData {
    tids: string[];
    nextStart: number;
    topicsCount: number;
    topics: TopicObject[];
}


export = function (Topics: TopicsI) {
    /**
     * Fetches an array of ungrouped topics
     * @param uid user id of current user
     * @returns Array of ungrouped topics
     */
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

    /**
     * Fetched topics assigned to a certain grouped
     * @param groupName name of group to fetch from
     * @param uid user id of current user
     * @returns Array of grouped topics
     */
    Topics.getGroupedTopics = async function (groupName, uid) {
        const params = {
            uid: uid,
        };
        const data = await Topics.getSortedTopics(params);
        const topics = await Topics.getTopics(data.tids, params);
        const ungroupedTopics = topics.filter(topic => topic.group && topic.group === groupName);
        data.topics = ungroupedTopics;
        return data;
    };

    /**
     * Assigns a topic to a certain group
     * @param tid topic id
     * @param groupName name of group
     */
    Topics.assignTopicToGroup = async function (tid, groupName) {
        await Topics.setTopicFields(tid, {
            group: groupName,
        });
    };
};
