define(['bootstrap/app', 'app/config-manager', 'services/http-service'], function (app) {
    'use strict';

    app.service('dictionary-service', ['http-service', function (http) {



        this.GetAllDic = function (callback) {

            var url = '/FgbzDic/getAllFgbzDictory';

            return http.post(url, null, callback);
        };

        //获取登陆用户下所有的组织以及人员
        this.grtUserListByOrgId = function (id, callback) {

            var url = '/System/grtUserListByOrgId?orgid='+id;
            return http.get(url, null, callback);
        }

    }]);
});