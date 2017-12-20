define(['bootstrap/app', 'utils', 'services/system-service', 'services/md5-service','services/staff-service'], function (app, utils) {
    'use strict';
    var cryto = require('utilities/cryto');
    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('login-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', '$uibModalInstance', 'values', 'system-service', '$cookies', 'md5-service','staff-service',
        function ($rootScope, $scope, $state, toaster, $uibModal, $modalInstance, values, systemService, $cookies, md5Service,staffService) {

            //变量
            var define_variable = function () {


            };

            //加载
            var initialize = function () {

                var account = localStorage.getItem('account');
                if (account) {
                    $scope.account = JSON.parse(account);
                    $scope.isremember = true;
                }
            };

            //方法
            var define_function = function () {

                $scope.nextStep = function (target) {
                    if (target.keyCode == 13) {
                        if ($scope.account && $scope.password) {
                            $scope.login();
                        }

                    }
                }

                $scope.remember = function () {
                    $scope.isremember = !$scope.isremember;
                }

                $scope.login = function () {
                    $scope.loginMessage = "";

                    if ($scope.isremember) {
                        localStorage.setItem('account', JSON.stringify($scope.account));
                    } else {
                        localStorage.removeItem('account');
                    }

                    var passwordjm = md5Service.mdsPassword($scope.password);

                    systemService.login($scope.account, passwordjm, function (res) {
                        if (res && res.LoginState) {
                            // userinfo
                            var loginUser = res.LoginResult;
                            // $cookies.put('loginUser', cryto.encrypt(JSON.stringify(loginUser)));
                            // staffService.setStaff(loginUser);
                            sessionStorage.setItem('loginUser', JSON.stringify(loginUser));
                            // ticket
                            var authID = res.ticket;
                            $cookies.put('AUTH_ID', authID);

                            location.reload();

                        } else {
                            $scope.password = "";
                            $scope.loginMessage = '帐号或密码错误。';
                        }
                    })
                }


                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            // 实际运行……
            define_variable();

            initialize();

            define_function();


        }]);
});