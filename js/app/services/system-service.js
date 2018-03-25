define(['bootstrap/app', 'app/config-manager', 'services/http-service'], function (app) {
    'use strict';

    app.service('system-service', ['http-service', function (http) {

        //登陆
        this.login = function (account, password, callback) {

            http.post('/System/Login', { "account": account, "password": password }, callback);
        }

        //邮件设置
        this.MailSetting = function (data, callback) {
            http.post('/System/MailSetting', {
                "MailServerAddress": data.MailServerAddress,
                "HairBoxAddress": data.HairBoxAddress,
                "Theme": data.Theme,
                "Text": data.Text,
                "NoPassTheme": data.NoPassTheme,
                "NoPassText": data.NoPassText,
                "PublishTheme": data.PublishTheme,
                "PublishText": data.PublishText
            }, callback);
        }

        this.getMailSetting = function (callback) {
            http.post('/System/getMailSetting', null, callback);
        }
        //保存审核
        this.SaveOrUpdateSettingValue = function (key, value, callback) {
            http.post('/System/SaveOrUpdateSettingValue', { "key": key, "value": value }, callback);
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
            http.get('/System/deleteRoleByID?id=' + id, null, callback);
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
        this.SaveOrUpdateUser = function (data, callback) {
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
            http.get('/FgbzDic/DeletePublishdepByID?id=' + id, null, callback);
        }

        //删除状态
        this.DeleteLawstandardStatusByID = function (id, callback) {
            http.get('/FgbzDic/DeleteLawstandardStatusByID?id=' + id, null, callback);
        }

        //保存或修改状态
        this.SaveOrUpdateLawstandardStatus = function (data, callback) {
            http.post('/FgbzDic/SaveOrUpdateLawstandardStatus', data, callback);
        }

        //获取状态列表
        this.getLawstandardStatusList = function (data, callback) {
            http.post('/FgbzDic/getLawstandardStatusList', data, callback);
        }

        //获取审核设置
        this.getApproveSetting = function (callback) {
            http.get('/System/getApproveSetting?', null, callback);
        }

        this.getSendMailSetting = function (callback) {
            http.get('/System/getSendMailSetting?', null, callback);
        }

        //保存审核配置
        this.SaveOrUpdateApproveSetting = function (data, callback) {
            http.get('/System/SaveOrUpdateApproveSetting?status=' + data, null, callback);
        }

        //获取日志列表
        this.getLogList = function (data, callback) {
            http.post('/System/getLogList', data, callback);
        }

        //处理历史数据
        this.handleHistory = function (path, callback) {
            http.post('/System/handleHistory', { "path": path }, callback);
        }

        //处理历史数据type
        this.hangldHistroyType = function (callback) {
            http.get('/Lawstandard/hangldHistroyType', null, callback);
        }

        //用户停用
        this.SaveUserStatus = function (id, type, callback) {
            http.get('/System/SaveUserStatus?id=' + id + '&type=' + type, null, callback);
        }

        this.getUserMailById = function (id, callback) {
            http.get('/System/getUserMailById?id=' + id, null, callback);
        }

        //发送邮件配置
        this.SaveOrUpdateMailSetting = function (data, callback) {
            http.get('/System/SaveOrUpdateMailSetting?status=' + data, null, callback);
        }

        this.grtUserListByOrgId = function (params, callback) {
            http.get('/System/grtUserListByOrgId?orgid=' + params, null, callback);
        }

    }]);
});