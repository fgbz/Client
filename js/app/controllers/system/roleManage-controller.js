define(['bootstrap/app', 'utils'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('roleManage-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', '$uibModalInstance', 'values',
        function ($rootScope, $scope, $state, toaster, $uibModal, $modalInstance, values) {



            //变量
            var define_variable = function () {
                $scope.checkdata = [];
                $scope.treeMenuData = [];
            };

            //加载
            var initialize = function () {

                $scope.title = values.Title;
                $scope.data = angular.copy(values.dataRole);
                $scope.isCheck = values.isCheck;

                var dics = JSON.parse(localStorage.getItem('DicItems'));

                $scope.menuItems = angular.copy(dics.Menu);

                function LoadTreeData(treeNodesData, parentId, flag) {
                    var data = [];
                    if (treeNodesData)
                        angular.forEach(treeNodesData, function (item) {
                            if (item.ParentID == parentId) {
                                var t = {
                                    'id': item.id,
                                    'menuname': item.menuname,
                                    'ParentID': item.ParentID,
                                    'Type': flag,
                                    'Extend': true,
                                    'IsCheck': item.IsCheck,
                                    'Nodes': LoadTreeData(treeNodesData, item.id, 1)
                                };

                                this.push(t);
                            }
                        }, data);
                    return data;
                };


                $scope.initDistext = function () {
                    $scope.displayText = "";
                    for (var i = 0; i < $scope.checkdata.length; i++) {
                        if (i < $scope.checkdata.length - 1) {
                            $scope.displayText += $scope.checkdata[i].menuname + ",";
                        } else {
                            $scope.displayText += $scope.checkdata[i].menuname;
                        }
                    }
                }

                //绑定选中项

                for (var j = 0; j < $scope.data.menus.length; j++) {
                    var flag = false;
                    for (var k = 0; k < $scope.menuItems.length; k++) {
                        if ($scope.menuItems[k].id == $scope.data.menus[j].id) {
                            flag = true;
                            $scope.checkdata.push($scope.menuItems[k]);
                            break;
                        }
                    }
                    if (flag) {
                        $scope.menuItems[k].IsCheck = true;
                    }
                }


                for (var i = 0; i < $scope.menuItems.length; i++) {
                    var data = {
                        id: $scope.menuItems[i].id,
                        menuname: $scope.menuItems[i].menuname,
                        ParentID: $scope.menuItems[i].parentid,
                        IsCheck: $scope.menuItems[i].IsCheck
                    }
                    $scope.treeMenuData.push(data);

                }
                $scope.initDistext();
                $scope.source = LoadTreeData($scope.treeMenuData, null, 0);




                $scope.Extend = function (item) {
                    item.Extend = !item.Extend;
                }

                $scope.expandTree = function () {
                    $scope.showTree = !$scope.showTree;
                };

            };

            //方法
            var define_function = function () {


                //点击checkbox
                $scope.clickfav = function (item) {
                    if (item.IsCheck) {
                        item.IsCheck = false;
                        deleteData(item);
                        $scope.initDistext();
                    } else {
                        item.IsCheck = true;
                        addData(item)
                        $scope.initDistext();
                    }

                }

                var addData = function (item) {

                    var flag = false;
                    for (var i = 0; i < $scope.checkdata.length; i++) {
                        if ($scope.checkdata[i].id == item.id) {
                            flag = true;
                            break;
                        }
                    }

                    if (!flag) {
                        var itemdata = angular.copy(item);

                        $scope.checkdata.push(itemdata);
                    }
                }

                var deleteData = function (item) {

                    for (var i = 0; i < $scope.checkdata.length; i++) {
                        if ($scope.checkdata[i].id == item.id) {
                            $scope.checkdata.splice(i, 1);
                            break;
                        }
                    }

                }
                $scope.clicktreeNode = function (params) {
                    $scope.treeModel = params.id;
                }

                $scope.ok = function () {
                    if (!$scope.data.rolename) {
                        toaster.pop({ type: 'danger', body: '请填写角色名称！',timeout:5000 });
                        return;

                    }
                    $scope.data.menus = [];

                    for (var i = 0; i < $scope.checkdata.length; i++) {
                        if ($scope.checkdata[i].IsCheck) {
                            $scope.data.menus.push({ id: $scope.checkdata[i].id });
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