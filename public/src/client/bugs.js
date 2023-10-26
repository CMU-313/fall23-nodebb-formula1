"use strict";

define("forum/bug-report", ["api", "alerts"], function (api, alerts) {
    const Bugs = {};

    Bugs.init = function () {
        handleSubmitBug();
    };

    function handleSubmitBug() {
        $("form").on("submit", function () {
            const name = $("#name").val();
            const description = $("#description").val();
            const bugData = {
                name: name,
                description: description,
                resolved: false,
            };

            Promise.all([api.post(`/bugs`, bugData)]).catch(alerts.error);
        });
    }
    return Bugs;
});
