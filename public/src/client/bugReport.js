'use strict';

define('forum/bug-report', ['api', 'alerts'], function (api, alerts) {
    const bugReport = {};

    bugReport.init = function () {
        app.enterRoom('bug-report');
        handleBugForm();
        bugReport.init('report');
    };

    function handleBugForm() {
        $('[component="bug/report"]').off('click').on('click', function (e) {
            // const group = $(this).attr('data-group');
            // const topic = $(this).parent().parent().attr('data-tid');

            api.put(`/bug-report-success`, { bugReport: 'data' })
                .then(() => alerts.success('Bug Reported'))
                .catch(alerts.error);
            e.preventDefault();
        });
    }

    return bugReport;
});
