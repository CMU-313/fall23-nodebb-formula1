'use strict';

define('forum/bug-report', [
    'api',
], function (api) {
    const Bugs = {};

    Bugs.init = function () {
        console.log('bugs init');
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
            api.post(`/bugs`, bugData);
        });
    }
    return Bugs;
});
