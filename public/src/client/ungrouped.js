'use strict';

define('forum/ungrouped', ['topicList', 'api', 'alerts'], function (topicList, api, alerts) {
    const Ungrouped = {};

    Ungrouped.init = function () {
        app.enterRoom('ungrouped_topics');
        handleGroupAssign();
        topicList.init('ungroup');
    };

    function handleGroupAssign() {
        $('[component="ungrouped/group"] [data-group]').off('click').on('click', function (e) {
            const group = $(this).attr('data-group'); // Get group name
            const tid = $(this).parent().parent().attr('data-tid'); // Get topic id

            api.put(`/topics/${tid}/assign`, { groupName: group })
                .then(() => alerts.success(`Topic assigned to ${group}`))
                .catch(alerts.error);
            e.preventDefault();
        });
    }

    return Ungrouped;
});
