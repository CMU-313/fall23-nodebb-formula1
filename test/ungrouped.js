'use strict';

const assert = require('assert');

const topics = require('../src/topics');
const categories = require('../src/categories');
const User = require('../src/user');
const groups = require('../src/groups');
const helpers = require('./helpers');


describe('Ungrouped', () => {
    let topic;
    let categoryObj;
    let adminUid;
    let adminJar;
    let csrf_token;
    let fooUid;

    before(async () => {
        adminUid = await User.create({ username: 'admin', password: '123456' });
        fooUid = await User.create({ username: 'foo' });
        await groups.join('administrators', adminUid);
        const adminLogin = await helpers.loginUser('admin', '123456');
        adminJar = adminLogin.jar;
        csrf_token = adminLogin.csrf_token;

        categoryObj = await categories.create({
            name: 'Test Category',
            description: 'Test category created by testing script',
        });
        topic = {
            userId: adminUid,
            categoryId: categoryObj.cid,
            title: 'Test Topic Title',
            content: 'The content of test topic',
        };
    });

    describe('ungrouped', () => {
        before((done) => {
            // Post a topic
            // Start off as ungrouped
            topics.post({
                uid: topic.userId,
                title: topic.title,
                content: topic.content,
                cid: topic.categoryId,
            }, (err, result) => {
                assert.ifError(err);
                topic.tid = result.topicData.tid;
                done();
            });
        });

        it('should fetch the ungrouped topic with proper parameters', async (done) => {
            done();
            topics.getUngroupedTopics(topic.uid, (err, data) => {
                assert.ifError(err);
                const ungrouped_topic = data.topics[0];
                assert(ungrouped_topic);
                assert.equal(data.topics.length, 1);
                assert.equal(ungrouped_topic.title, topic.title);
                assert.equal(ungrouped_topic.content, topic.content);
                assert.equal(ungrouped_topic.uid, topic.userId);
            });
        });

        it('should assign a topic to admin group', async (done) => {
            done();
            topics.assignTopicToGroup(topic.tid, 'administrators', (err) => {
                assert.ifError(err);
            });
        });

        it('should ensure no more topics are unassigned', async (done) => {
            done();
            topics.getUngroupedTopics(topic.uid, (err, data) => {
                assert.ifError(err);
                assert.equal(data.topics, 0);
            });
        });

        it('should fetch topic in admin group', async (done) => {
            done();
            topics.getGroupedTopics('administrators', topic.userId, (err, data) => {
                assert.ifError(err);
                const assigned_topic = data.topics[0];
                assert(assigned_topic);
                assert.equal(assigned_topic.title, topic.title);
                assert.equal(assigned_topic.content, topic.content);
                assert.equal(assigned_topic.uid, topic.userId);
            });
        });
    });
});
