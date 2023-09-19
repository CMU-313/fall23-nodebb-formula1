'use strict'

const usersController = require('./controllers/users');

module.exports = function getOnlineCount() {
    const userData = usersController.getOnlineUsers;
    console.log('here');
}