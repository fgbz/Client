define(['bootstrap/app', 'app/config-manager', 'services/http-service'], function (app) {
    'use strict';

    app.service('regulation-service', ['http-service', function (http) {

        //查询法规类别目录
        this.SelectLawstandardType = function (callback, errorcallback) {
            http.post('/Lawstandard/SelectLawstandardType', null, callback);
        };
        //新增修改法规类别目录
        this.AddOrUpdateLawstandardType = function (data, callback) {
            http.post('/Lawstandard/AddOrUpdateLawstandardType', data, callback);
        };
        //删除法规类别目录
        this.DeleteLawstandardType = function (data, callback) {
            http.post('/Lawstandard/DeleteLawstandardType', data, callback);
        };

        //查询法规标准
        this.getLawstandardList = function (data, callback) {
            http.post('/Lawstandard/getLawstandardList', data, callback);
        };

        //获取全文检索数量
        this.getSolrList = function (data, callback) {
            http.post('/Lawstandard/getSolrList', data, callback);
        }

        //获取最新10条法规标准
        this.getUptodateLawstandardList = function (data, callback) {
            http.post('/Lawstandard/getUptodateLawstandardList', data, callback);
        }

        //新增或编辑法规标准
        this.SaveOrUpdateLawstandard = function (data, callback) {
            http.post('/Lawstandard/SaveOrUpdateLawstandard', data, callback);
        };

        //获取法规详情
        this.getLawstandardById = function (id, callback) {
            http.get('/Lawstandard/getLawstandardById?id='+id, null, callback);
        };


        //点击次数加一
        this.AddLawstandardCount = function (data, callback) {
            http.post('/Lawstandard/AddLawstandardCount', data, callback);
        }

        //置顶
        this.LawstandardIsTop = function (data, callback) {
            http.post('/Lawstandard/LawstandardIsTop', data, callback);
        }

        this.DeleteLawstandardById = function (data, callback) {
            http.post('/Lawstandard/DeleteLawstandardById', data, callback);
        }

        //首页
        this.getHomeChart = function (callback) {
            http.get('/Lawstandard/getHomeChart', null, callback);
        }

        //类别导航
        this.getHomePageLawsType = function (callback) {
            http.get('/Lawstandard/getHomePageLawsType', null, callback);
        }

        //批量删除
        this.DeleteAllSelectLawstandard = function (data, callback) {
            http.post('/Lawstandard/DeleteAllSelectLawstandard', data, callback);
        }


    }]);
});