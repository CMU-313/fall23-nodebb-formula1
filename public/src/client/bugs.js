'use strict';

define('forum/bug-report', [
    'api', 'alerts',
], function (api, alerts) {
    const Bugs = {};

    Bugs.init = function () {
        handleSubmitBug();
    };

    function handleSubmitBug() {
        $('form').on('submit', function () {
            const name = $('#name').val();
            const email = $('#email').val();
            const date = $('#date').val();
            const description = $('#description').val();
            const bugData = {
                name: name,
                email: email,
                date: date,
                description: description,
            };
            console.log(bugData);
            Promise.all([
                api.put(`/bugs`, bugData),
            ]).catch(alerts.error);
            // api.put(`/bugs`, bugData)
            //     .then(() => alerts.success('Bug Report Submitted'))
            //     .catch(alerts.error);
            // e.preventDefault();
            // api.post(`/bugs`, bugData);
        });
    }
    return Bugs;
});
