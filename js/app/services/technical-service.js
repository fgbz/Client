define(['bootstrap/app', 'app/config-manager', 'services/http-service'], function (app) {
    'use strict';

    app.service('technical-service', ['http-service', function (http) {

        //查询技术文件目录
        this.SelectTechnicalType = function ( callback) {
            http.post('/Technical/SelectTechnicalType', null, callback);
        };
         //新增修改技术文件目录
        this.AddOrUpdateTechnicalType = function (data,callback) {
            http.post('/Technical/AddOrUpdateTechnicalType', data, callback);
        };
         //删除技术文件目录
        this.DeleteTechnicalType = function (data,callback) {
            http.post('/Technical/DeleteTechnicalType', data, callback);
        };


        

        //查询技术文件标准
        this.getTechnicalList = function (data,callback) {
             http.post('/Technical/getTechnicalList', data, callback);
        };

        //新增或编辑技术文件
        this.SaveOrUpdateTechnical = function (data,callback) {
            http.post('/Technical/SaveOrUpdateTechnical', data, callback);
        };

        //获取技术文件
        this.getTechnicalById = function (data,callback) {
             http.post('/Technical/getTechnicalById', data, callback);
        };
        //删除
        this.DeleteTechnicalById  = function (data,callback) {
             http.post('/Technical/DeleteTechnicalById', data, callback); 
        }



    }]);
});