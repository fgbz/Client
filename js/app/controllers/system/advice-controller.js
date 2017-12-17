define(['bootstrap/app', 'utils', 'services/usercenter-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('advice-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', '$uibModalInstance', 'values', 'usercenter-service',
        function ($rootScope, $scope, $state, toaster, $uibModal, $modalInstance, values, usercenterService) {

            var user = localStorage.getItem("loginUser");

            if (user) {
                user = JSON.parse(user);
            }

            //变量
            var define_variable = function () {
                $scope.data = {};

            };

            //加载
            var initialize = function () {

                $scope.title = values.Title;
                $scope.isCheck = values.isCheck;

                if (values.id) {
                    //初始化
                    usercenterService.GetAdviceByID(values.id, function (res) {
                        $scope.data = res;
                        $scope.data.inputdate = utils.parseTime(new Date($scope.data.inputdate), "YYYY-MM-DD");
                        $scope.data.modifyuserid = user.id;
                    })
                } else {
                    $scope.data.id = "";
                    $scope.data.inputuserid = user.id;
                    $scope.data.orgname = user.orgname;
                    $scope.data.inputdate = utils.format(new Date(), "yyyy-MM-dd");
                }


            };

            //方法
            var define_function = function () {


                $scope.ok = function () {
                    if (!$scope.data.title) {
                        toaster.pop({ type: 'danger', body: '请填写标题！' });
                        return;

                    }
                    if (!$scope.data.details) {
                        toaster.pop({ type: 'danger', body: '请填写内容！' });
                        return;

                    }
                    usercenterService.SaveOrUpdateAdvice($scope.data, function (params) {
                        if (params == 200) {
                            toaster.pop({ type: 'success', body: $scope.title + '成功！' });
                            $modalInstance.close(params);

                        } else {
                            toaster.pop({ type: 'danger', body: $scope.title + '失败！' });
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