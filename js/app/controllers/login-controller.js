define(['bootstrap/app', 'app/config-manager', 'services/authorization-service', 'services/accessory-service', 'utilities/cryto', 'setting'], function (app) {
    'use strict';

    var cryto = require('utilities/cryto');

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();

    app.controller('login-controller', ['$rootScope', '$scope', '$cookies', '$state', 'http-service', 'authorization-service', '$uibModal', 'accessory-service', '$location', function ($rootScope, $scope, $cookies, $state, http_service, auth_service, $modal, accessory_service, $location) {
        var PUMPKIN_COOKIE_SESSION = 'PUMPKIN_SESSION';
        var COOKIE_ROLES = 'ROLES_SESSION';
        var COOKIE_PUMPKIN = 'PUMPKIN';
        var COOKIE_INDENTIFY_CODE = 'IndentifyCode';
        var loginApi = require('setting');

        // 变量的定义。
        var define_variable = function () {
            // 定义 - 初始化界面对象数据
            $scope.staff = {};
            $scope.staff.account = undefined;
            $scope.staff.password = undefined;

            // 定义 - 默认不显示验证码
            $scope.indentify_code = undefined;
            $scope.isShowIndentify = false;

            // 定义 - 记住账号
            $scope.remember_account = false;

            // 定义 - 公告列表
            $scope.noticeItem = [];

            // 定义 - 公告列表是否加载
            $scope.isLoaded = false;

            //定义 - 公告更多显示
            $scope.noticeMoreBtn = false;

            //定义 - 公告首页列表显示个数
            var pageNumber = 3;

            // //定义 - 当前时间
            // $scope.CurrentTime = new Date().getTime();
        };

        //如果是login-sso登录
        var define_function = function () {
  
            // 定义 - 处理键盘 Enter 按键。
            $scope.nextStep = function ($event, next) {
                if ($event.keyCode == 13) {
                    if (next == 'password') {
                        document.getElementById(next).focus();
                    };
                    if (next == 'submit') {
                        if ($scope.isShowIndentify && !$scope.indentify_code && document.getElementById("indentify_code")) {
                            document.getElementById("indentify_code").focus();
                        } else {
                            $scope.Login($scope.staff.account, $scope.staff.password);
                        }

                    };
                }
            };

            // 定义 - 登录方法
            $scope.Login = function (account, psd) {
               
                $state.go('main.home');
                              
            };

            // 定义 - 刷新验证码
            $scope.RefreshCaptcha = function () {
                var dir = "";
                var address = location.href;
                var arr = address.split('/');
                if (arr.length > 3 && arr[3] != "" && arr[3] != "#") {
                    dir = arr[3];
                }
                $scope.indentify_code = undefined;
                $scope.CaptchaCode = baseUrl + 'Auth/IndentifyCode?dir=' + dir + '&t=' + new Date().getTime();
            };

            //系统帮助
            $scope.help = function (pageNumber) {
                if (pageNumber) {
                    window.open('usermanual/web/viewer.html#page=' + pageNumber, "_blank");
                } else {
                    window.open('usermanual/web/viewer.html', "_blank");
                }
            }
        }





        // 以下是直接执行的行为代码
        // 判断当前的状态，如果已经登录过，则进入主界面。
        var session = $cookies.get(PUMPKIN_COOKIE_SESSION);

        if (session != undefined) {

            var sessionObject = JSON.parse(cryto.decrypt(session));

        };


        define_variable();

        define_function();

    }]);
});