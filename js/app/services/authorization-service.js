define(['bootstrap/app', 'app/config-manager', 'services/http-service'], function (app) {
    'use strict';

    app.service('authorization-service', ['http-service', '$cookies', function (http, $cookies) {
        var staffObj = {};
        //  存下来 Staff 对象，用于其它页面使用。
        this.setStaff = function (staff) {

            staffObj = staff;
        };

        // 获取 Staff 对象。
        this.getStaff = function () {

            return staffObj;
        };

        //搜集客户端环境信息
        this.clientInfo = function () {
            var getBrowserInfo = function () {
                var agent = navigator.userAgent.toLowerCase();
                var regStr_ie = /msie [\d.]+;/gi;
                var regStr_ff = /firefox\/[\d.]+/gi
                var regStr_chrome = /chrome\/[\d.]+/gi;
                var regStr_saf = /safari\/[\d.]+/gi;
                //IE
                if (agent.indexOf("msie") > 0) {
                    return agent.match(regStr_ie);
                }
                //firefox
                if (agent.indexOf("firefox") > 0) {
                    return agent.match(regStr_ff);
                }
                //Chrome
                if (agent.indexOf("chrome") > 0) {
                    return agent.match(regStr_chrome);
                }
                //Safari
                if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
                    return agent.match(regStr_saf);
                }

                return [navigator.appName];
            }

            var data = {
                "Browser": getBrowserInfo()[0],
                // "Id":"1627aea5-8e0a-4371-9022-9b504344e724",
                // "MACAddress":"MACAddress",
                "OperatingSystem": navigator.userAgent,
                // "RecordTime":9223372036854775807,
                "Resolution": window.screen.width + '*' + window.screen.height,
                // "StaffId":"1627aea5-8e0a-4371-9022-9b504344e724",
                "Type": "1"
            }

            return http.post('Auth/ClientInfo', data);
        }


        // 登录
        this.login = function (account, password) {

            var login_request = {
                Account: account,
                Password: password
            };

            return http.post('Auth/Login', JSON.stringify(login_request));
        };

        // 判断是否得到授权使用系统
        this.IsAuthorized = function () {

            return http.get('Auth/IsAuthorized');
        };

        //判断是帐号异地登录了
        this.IsRemoteOccupy = function (account) {

            return http.get('Auth/IsRemoteOccupy?account=' + account);
        }
        //session是否超时
        this.isTimeOut = function () {

            var url = 'Petition/isTimeOut';

            return http.post(url, null);
        }

        // 注销
        this.logout = function () {
            //var url="Auth/Logout";

            return http.post('Auth/Logout', null, null, angular.noop);
        };

        // 刷新验证码
        this.refreshCaptchaCode = function () {

            return http.get('Auth/IndentifyCode');
        }

        this.updatePassword = function (data) {

            var url = 'Auth/UpdatePassword';

            return http.post(url, data);
        };

        //重置密码
        this.ResetPassword = function (data) {

            var url = 'Auth/ResetPassword?staffId=' + data.staffId;

            return http.post(url, data);
        };

        //获取服务端的版本信息,显示到界面上
        this.version = function () {
            return http.get('Auth/Version');
        }
    }]);
});