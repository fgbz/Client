define(['bootstrap/app', 'app/config-manager', 'services/http-service'], function (app) {
    'use strict';

    app.service('system-service', ['http-service', function (http) {

        //登陆
        this.login = function (account,password,callback) {

            http.post('/System/Login',  { "account": account, "password": password }, callback);
        }

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

        //查询用户列表
        this.getUserList = function (data, callback) {
             http.post('/System/getUserList', data, callback);
        }
        //保存或编辑用户
        this.SaveOrUpdateUser =function (data, callback) {
            http.post('/System/SaveOrUpdateUser', data, callback);
        }

         //删除用户
        this.deleteUserByID = function (data, callback) {
             http.post('/System/deleteUserByID', data, callback);
        }

        //获取所有角色
        this.getAllRoles = function (callback) {
             http.post('/System/getAllRoles', null, callback);
        }

        //保存或编辑
        this.SaveOrUpdatePublishdep = function (data, callback) {
             http.post('/FgbzDic/SaveOrUpdatePublishdep', data, callback);
        }

         //获取发布部门列表
        this.getPublishdepList = function (data, callback) {
             http.post('/FgbzDic/getPublishdepList', data, callback);
        }

        //删除发布部门
        this.DeletePublishdepByID = function (id, callback) {
             http.get('/FgbzDic/DeletePublishdepByID?id='+id, null, callback);
        }


    }]);
});