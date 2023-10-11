'use strict';

define('forum/bug-report', [
    'api', 'alerts',
], function (api, alerts) {
    const Bugs = {};

    Bugs.init = function () {
        handleSubmitBug();
    };

    console.log('hello');

    function handleSubmitBug() {
        $('form').on('submit', function () {
            const name = $('#name').val();
            // eslint-disable-next-line no-unused-vars
            const email = $('#email').val();
            const date = $('#date').val();
            const description = $('#description').val();
            const bugData = {
                title: name,
                description: description,
                timestamp: date,
                resolved: false,
            };
            console.log(bugData);
            Promise.all([
                api.post(`/bugs`, bugData),
            ]).catch(alerts.error);
        });
    }
    return Bugs;
});
