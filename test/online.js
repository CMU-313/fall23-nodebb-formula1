'use strict';

const assert = require('assert');
const async = require('async');
const fs = require('fs');
const path = require('path');
const nconf = require('nconf');
const validator = require('validator');
const request = require('request');
const requestAsync = require('request-promise-native');
const jwt = require('jsonwebtoken');

const db = require('./mocks/databasemock');
const User = require('../src/user');
const Topics = require('../src/topics');
const Categories = require('../src/categories');
const Posts = require('../src/posts');
const Password = require('../src/password');
const groups = require('../src/groups');
const messaging = require('../src/messaging');
const helpers = require('./helpers');
const meta = require('../src/meta');
const file = require('../src/file');
const socketUser = require('../src/socket.io/user');
const apiUser = require('../src/api/users');
const utils = require('../src/utils');
const privileges = require('../src/privileges');

describe('User', () => {
    describe('User.getGroupOnlineCount', () => {
        it('should return the count of online users in the specified group', async () => {
            // Assuming you have a way to set up a test environment with online users and groups
            // Create some mock data for testing
            const groupName = 'testGroup';
            const onlineUserIds = [1, 2, 3, 4, 5]; // Online user IDs in the test group

            // Mock the `User.getUidsFromSet` and `groups.isMembers` functions to return expected data
            const originalGetUidsFromSet = User.getUidsFromSet;
            const originalIsMembers = groups.isMembers;
            User.getUidsFromSet = async (setName, start, end) => onlineUserIds;
            console.log('ONLINEUSERS', onlineUserIds, User.getUidsFromSet);
            groups.isMembers = async (uids, group) => uids.map(uid => uid === group);

            const count = await User.getGroupOnlineCount(groupName);

            // Assert that the count matches the expected count of online users in the group
            assert.strictEqual(count, onlineUserIds.length);

            // Restore the original functions
            User.getUidsFromSet = originalGetUidsFromSet;
            groups.isMembers = originalIsMembers;
        });
    });
});
