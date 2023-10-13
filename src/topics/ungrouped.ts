import { TopicObject } from '../types';

interface TopicsI {
  getUngroupedTopics: (uid: number) => Promise<TopicData>;
  getGroupedTopics: (group: string, uid: number) => Promise<TopicData>;
  getSortedTopics: (params: Params) => Promise<TopicData>;
  getTopics: (tids: number[], params: Params) => Promise<TopicObject[]>;
  assignTopicToGroup: (tid: number, groupName: string) => Promise<void>;
  setTopicFields: (tid: number, data: {[key: string]: string}) => Promise<void>;
}

interface Params {
    term?: string;
    sort?: string;
    query?: string;
    cids?: number[] | number;
    tags?: string[];
    uid?: number;
}

interface TopicData {
    tids: number[];
    nextStart: number;
    topicsCount: number;
    topics: TopicObject[];
}

/**
 * Determines whether a groupname is invalid
 * @param group string
 * @returns true is group is empty, else false
 */
function isInvalidGroup(group: string) {
    return !group || group === '';
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
        const ungroupedTopics = topics.filter(topic => isInvalidGroup(topic.group));
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
