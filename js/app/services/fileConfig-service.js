define(['bootstrap/app', 'app/config-manager', 'services/http-service'], function (app) {
    'use strict';

    app.service('fileConfig-service', ['http-service', function (http) {


        this.SaveOrUpdate = function (data) {

            var url = 'FileConfig/SaveOrUpdateFileConfig';

            return http.post(url, data);
        };

        this.Query = function (data) {
            var url = "FileConfig/QueryFileConfig";

            return http.post(url,data);
        };

        this.Delete = function (id) {
            var url = "FileConfig/Delete?id="+id;

            return http.get(url);
        }

    }]);
});