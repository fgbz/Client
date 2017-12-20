define(['bootstrap/app', 'utils', 'app/config-manager', 'services/usercenter-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('examCheck-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', '$uibModalInstance', 'values', 'usercenter-service','$cookies',
        function ($rootScope, $scope, $state, toaster, $uibModal, $modalInstance, values, usercenterService,$cookies) {


          var user = sessionStorage.getItem('loginUser');
            if (user) {
                user = JSON.parse(user);
            }
            //变量
            var define_variable = function () {
                $scope.data = {};
                $scope.data.id = "";
                $scope.data.approveUserID = user.id;
                $scope.data.username = user.userrealname;
                $scope.data.inputorgname = user.orgname;
                $scope.data.approveDate = utils.format(new Date(), "yyyy-MM-dd");
                $scope.data.status = 1;
                $scope.data.lawstandardID = values.item.id;
                $scope.isCheck = values.isCheck;

            };

            //加载
            var initialize = function () {


                usercenterService.getApproveHistroy( $scope.data.lawstandardID,function (params) {
                    $scope.histroyItems = params;
                })


            };

            //方法
            var define_function = function () {


                $scope.ok = function () {
                    if ($scope.data.status == 0) {
                        if (!$scope.data.content) {
                            toaster.pop({ type: 'danger', body: '审核不通过必须填写说明！' });
                            return;
                        }

                    }
                    usercenterService.SaveApprove($scope.data, function (params) {
                        if (params == 200) {
                            toaster.pop({ type: 'success', body: '审核成功！' });
                           $modalInstance.close(params);
                        } else {
                            toaster.pop({ type: 'waring', body: '审核失败！' });
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