define(['bootstrap/app', 'app/config-manager', 'services/http-service'], function (app) {
    'use strict';

    app.service('dictionary-service', ['http-service', function (http) {



        this.GetAllDic = function (callback) {

            var url = '/FgbzDic/getAllFgbzDictory';

            return http.post(url,null,callback);
        };

    }]);
});