define(['bootstrap/app', 'utils'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('roleManage-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', '$uibModalInstance', 'values',
        function ($rootScope, $scope, $state, toaster, $uibModal, $modalInstance, values) {



            //变量
            var define_variable = function () {


            };

            //加载
            var initialize = function () {

                $scope.title = values.Title;
                $scope.data = angular.copy(values.dataRole);
                $scope.isCheck = values.isCheck;

                var dics = JSON.parse(localStorage.getItem('DicItems'));

                $scope.menuItems = dics.Menu;

                //绑定选中项
                if ( $scope.data.menus != null &&  $scope.data.menus.length > 0) {
                    for (var i = 0; i < $scope.menuItems.length; i++) {
                        var flag = false;
                        for (var j = 0; j <  $scope.data.menus.length; j++) {
                            if ($scope.menuItems[i].id ==  $scope.data.menus[j].id) {
                                flag = true;
                                break;
                            }
                        }
                        $scope.menuItems[i].ischeck = flag ? true : false;
                    }
                }

            };

            //方法
            var define_function = function () {

                $scope.clickSingle =function (item) {
                    if (item.ischeck) {
                        item.ischeck = false;
                    } else {
                        item.ischeck = true;
                    }
                }

                $scope.ok = function () {
                    if (!$scope.data.rolename) {
                        toaster.pop({ type: 'danger', body: '请填写角色名称！' });
                        return;

                    }
                    $scope.data.menus = [];

                    for (var i = 0; i < $scope.menuItems.length; i++) {
                        if ($scope.menuItems[i].ischeck) {
                            $scope.data.menus.push($scope.menuItems[i]);
                        }
                    }

                    $modalInstance.close($scope.data);

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