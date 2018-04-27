define(['bootstrap/app', 'utils', 'services/usercenter-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('addsuggestion-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', '$uibModalInstance', 'values', 'usercenter-service','$cookies',
        function ($rootScope, $scope, $state, toaster, $uibModal, $modalInstance, values, usercenterService,$cookies) {

            var user = sessionStorage.getItem('loginUser');

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

                if (values.suggData) {
                    //初始化
                    $scope.data = angular.copy(values.suggData); 
                    $scope.data.inputdate = utils.parseTime(new Date($scope.data.inputdate), "YYYY-MM-DD hh:mm:ss");
                    $scope.data.modifyuserid = user.id;

                } else {
                    $scope.data.id = "";
                    $scope.data.inputuserid = user.id;
                    $scope.data.inputname = user.userrealname;
                    $scope.data.inputdate = utils.format(new Date(), "yyyy-MM-dd hh:mm:ss");
                }


            };

            //方法
            var define_function = function () {


                $scope.ok = function () {
                    if (!$scope.data.title) {
                        toaster.pop({ type: 'danger', body: '请填写标题！' ,timeout:5000});
                        return;

                    }
                    if (!$scope.data.details) {
                        toaster.pop({ type: 'danger', body: '请填写内容！' ,timeout:5000});
                        return;

                    }
                    var requestData = angular.copy($scope.data);
                    //不传录入时间到服务端
                    delete requestData.inputdate;
                    usercenterService.SaveOrUpdateSuggestion(requestData, function (params) {
                        if (params == 200) {
                            toaster.pop({ type: 'success', body: $scope.title + '成功！' ,timeout:5000});
                            $modalInstance.close(params);

                        } else {
                            toaster.pop({ type: 'danger', body: $scope.title + '失败！',timeout:5000 });
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