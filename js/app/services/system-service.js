define(['bootstrap/app', 'app/config-manager', 'services/http-service'], function (app) {
    'use strict';

    app.service('system-service', ['http-service', function (http) {

        //查询组织机构
        this.getOrganizationList = function (callback) {
            http.post('/System/getOrganizationList', null, callback);
        };
        //新增修改组织机构
        this.AddOrUpdateOrganizationType = function (data, callback) {
            http.post('/System/AddOrUpdateOrganizationType', data, callback);
        };
        //删除组织机构
        this.DeleteOrganization = function (data, callback) {
            http.post('/System/DeleteOrganization', data, callback);
        };

        //获取角色列表
        this.getRoles = function (data, callback) {
            http.post('/System/getRoles', data, callback);
        };

        //删除角色
        this.deleteRoleByID = function (id, callback) {
            http.get('/System/deleteRoleByID?id='+id, null, callback);
        };

        //新增或编辑角色
        this.SaveOrEditRole = function (data, callback) {
            http.post('/System/SaveOrEditRole', data, callback);
        };




    }]);
});