define(['bootstrap/app', 'utils', 'services/regulation-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('addReplaceOrReference-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', '$uibModalInstance', 'values', 'regulation-service',
        function ($rootScope, $scope, $state, toaster, $uibModal, $modalInstance, values, regulationService) {


            var user = sessionStorage.getItem('loginUser');
            if (user) {
                user = JSON.parse(user);
            }

            //变量
            var define_variable = function () {

                $scope.isSaving = false;
            };

            //加载
            var initialize = function () {

                $scope.data = {};
                $scope.data.chinesename = values.chinesename;
                $scope.data.code = values.code;
                $scope.data.id = values.id;
                $scope.isEdit = values.isEdit;
                $scope.data.inputuserid = user.id;
                $scope.data.modifyuserid = user.id;

                $scope.data.approvestatus = 4;
            };

            //方法
            var define_function = function () {

                $scope.ok = function () {
                    $scope.isSaving = true;

                    if (!$scope.data.chinesename) {
                        toaster.pop({ type: 'danger', body: '请填写中文标题！',timeout:0 });
                        $scope.isSaving = false;
                        return;
                    }
                    if (!$scope.data.code) {
                        toaster.pop({ type: 'danger', body: '请填写编号！',timeout:0 });
                        $scope.isSaving = false;
                        return;
                    }


                    regulationService.SaveReplaceOrRefence($scope.data, function (response) {
                        if (response == 200) {
                            toaster.pop({ type: 'success', body: '保存成功!' ,timeout:0});
                            $modalInstance.close(response);
                        } else if (response == 461) {
                            toaster.pop({ type: 'danger', body: '编号重复!' ,timeout:0});
                        } else {
                            toaster.pop({ type: 'danger', body: '保存失败!',timeout:0 });
                        }
                        $scope.isSaving = false;
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