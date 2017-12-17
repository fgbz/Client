define(['bootstrap/app', 'app/config-manager', 'services/http-service'], function (app) {
    'use strict';

    app.service('usercenter-service', ['http-service', function (http) {

        //保存通知
        this.SaveOrUpdateAdvice = function (data, callback) {
            http.post('/UserCenter/SaveOrUpdateAdvice', data, callback);
        };

        //删除通知
        this.DeleteAdviceByID = function (id, callback) {
            var url = "/UserCenter/DeleteAdviceByID?id=" + id;
            http.get(url, null, callback);
        };

        //获取技术文件
        this.GetAdviceByID = function (id, callback) {
            var url = "/UserCenter/GetAdviceByID?id=" + id;
            http.get(url, null, callback);
        };
        //获取通知列表
        this.getAdviceList = function (data, callback) {
            http.post('/UserCenter/getAdviceList', data, callback);
        };

        //获取最新10条通知
        this.getUpToDateAdviceinfos = function (data,callback) {
            http.post('/UserCenter/getUpToDateAdviceinfos', data, callback);
        };



    }]);
});