define(['bootstrap/app', 'app/config-manager', 'services/http-service'], function (app) {
    'use strict';

    app.service('staff-service', ['http-service', function (http) {

        var staffObj = {};
        //  存下来 Staff 对象，用于其它页面使用。
        this.setStaff = function (staff) {

            staffObj = staff;
        };

        // 获取 Staff 对象。
        this.getStaff = function () {

            return staffObj;
        };

    }]);
});