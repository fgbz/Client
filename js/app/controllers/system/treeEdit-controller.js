define(['bootstrap/app', 'utils'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('treeEdit-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', '$uibModalInstance', 'values',
        function ($rootScope, $scope, $state, toaster, $uibModal, $modalInstance, values) {



            //变量
            var define_variable = function () {


            };

            //加载
            var initialize = function () {

                $scope.title = values.Title;
                $scope.Name = values.Name;
            };

            //方法
            var define_function = function () {

                $scope.ok = function () {
                    if (!$scope.Name) {
                        toaster.pop({ type: 'danger', body: '请填写节点名称！' });
                        return;

                    }

                    $modalInstance.close($scope.Name);

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