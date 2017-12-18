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
        this.getUpToDateAdviceinfos = function (data, callback) {
            http.post('/UserCenter/getUpToDateAdviceinfos', data, callback);
        };

        //获取留言信息
        this.getSuggestionList = function (data, callback) {
            http.post('/UserCenter/getSuggestionList', data, callback);
        }

        //删除留言
        this.DeleteSuggestionByID = function (id, callback) {
            var url = "/UserCenter/DeleteSuggestionByID?id=" + id;
            http.get(url, null, callback);
        }

        //保存留言
        this.SaveOrUpdateSuggestion = function (data, callback) {
            http.post('/UserCenter/SaveOrUpdateSuggestion', data, callback);
        }

        //保存审核
        this.SaveApprove = function (data, callback) {
            http.post('/UserCenter/SaveApprove', data, callback);
        }

        //获取审核信息
        this.getApproveHistroy = function (id, callback) {
            var url = "/UserCenter/getApproveHistroy?id=" + id;
            http.get(url, null, callback);
        }

    }]);
});