define(['bootstrap/app', 'app/config-manager', 'services/http-service'], function (app) {
    'use strict';

    app.service('main-service', ['http-service', function (http) {


        this.getNotices = function () {

            var url = 'Sys/Auth/Logout';

            return http.get(url);
        };


    }]);
});