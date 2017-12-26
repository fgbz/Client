define(['bootstrap/app', 'utils', 'services/regulation-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('reference-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', '$uibModalInstance', 'regulation-service', 'values',
        function ($rootScope, $scope, $state, toaster, $uibModal, $modalInstance, regulationService, values) {

            var user = sessionStorage.getItem('loginUser');
            if (user) {
                user = JSON.parse(user);
            }

            var dics = JSON.parse(localStorage.getItem('DicItems'));

            $scope.PageSize = dics.PageSize;

            //变量
            var define_variable = function () {
                $scope.pager = {
                    size: 5,
                    current: 1
                }

                $scope.data = [];

                $scope.title = values.title;

            };

            //加载
            var initialize = function () {

                $scope.isLoaded = true;

                $scope.search = function (isPaging) {
                    $scope.isLoaded = false;

                    //通过当前高度计算每页个数
                    var pagesize = 5;

                    if (!isPaging) {
                        $scope.pager.current = 1;
                    }

                    $scope.pager.size =  $scope.PageSize ;

                    var options = {
                        pageNo: $scope.pager.current,
                        pageSize: $scope.pager.size,
                        conditions: []
                    };
                    if ($scope.Number) {
                        options.conditions.push({ key: 'Number', value: $scope.Number });
                    }
                    if ($scope.Title) {
                        options.conditions.push({ key: 'Title', value: $scope.Title });
                    }
                    options.conditions.push({ key: 'ReplaceOrRefenceid', value: user.id });
                    options.conditions.push({ key: 'ApproveStatus', value: 3 });

                    regulationService.getLawstandardList(options, function (response) {
                        $scope.isLoaded = true;
                        $scope.items = response.CurrentList;

                        angular.forEach($scope.items, function (value, key) {
                            angular.extend($scope.items[key], { IsCheck: false });
                        });
                        $scope.pager.total = response.RecordCount;
                    })

                }
                $scope.search();

                $scope.selectAll = false;
            };

            //方法
            var define_function = function () {

                $scope.clickAll = function () {

                    if ($scope.selectAll) {
                        angular.forEach($scope.items, function (value, key) {
                            value.IsCheck = false;
                            deleteData(value);
                        });
                        $scope.selectAll = false;
                    } else {
                        angular.forEach($scope.items, function (value, key) {
                            value.IsCheck = true;
                            addData(value);
                        });
                        $scope.selectAll = true;
                    }

                }

                $scope.clickSingle = function (item) {

                    if (item.IsCheck) {
                        item.IsCheck = false;
                        deleteData(item);
                    } else {
                        item.IsCheck = true;
                        addData(item);
                    }

                }

                var addData = function (item) {

                    var flag = false;
                    for (var i = 0; i < $scope.data.length; i++) {
                        if ($scope.data[i].id == item.id) {
                            flag = true;
                            break;
                        }
                    }

                    if (!flag) {
                        var itemdata = angular.copy(item);
                        delete itemdata.IsCheck;
                        $scope.data.push(itemdata);
                    }
                }

                var deleteData = function (item) {

                    for (var i = 0; i < $scope.data.length; i++) {
                        if ($scope.data[i].id == item.id) {
                            $scope.data.splice(i, 1);
                            break;
                        }
                    }

                }

                $scope.ok = function () {
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