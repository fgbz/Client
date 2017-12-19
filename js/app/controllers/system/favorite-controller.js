define(['bootstrap/app', 'utils', 'app/config-manager', 'services/usercenter-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('favorite-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', '$uibModalInstance', 'values', 'usercenter-service',
        function ($rootScope, $scope, $state, toaster, $uibModal, $modalInstance, values, usercenterService) {


            var user = localStorage.getItem("loginUser");

            if (user) {
                user = JSON.parse(user);
            }
            //变量
            var define_variable = function () {
                $scope.data = {};

                $scope.checkdata = [];
            };

            //加载
            var initialize = function () {


                function LoadTreeData(treeNodesData, parentId, flag) {
                    var data = [];
                    if (treeNodesData)
                        angular.forEach(treeNodesData, function (item) {
                            if (item.ParentID == parentId) {
                                var t = {
                                    'id': item.id,
                                    'Name': item.Name,
                                    'ParentID': item.ParentID,
                                    'Type': flag,
                                    'Extend': true,
                                    'IsCheck': false,
                                    'Nodes': LoadTreeData(treeNodesData, item.id, 1)
                                };

                                this.push(t);
                            }
                        }, data);
                    return data;
                };

                //获取收藏夹
                usercenterService.getFavoriteList(user.favoriteid, function (params) {

                    $scope.treeFavoriteData = [];

                    for (var i = 0; i < params.length; i++) {
                        var data = {
                            id: params[i].id,
                            Name: params[i].name,
                            ParentID: params[i].parentid
                        }
                        $scope.treeFavoriteData.push(data);

                    }
                    $scope.source = LoadTreeData($scope.treeFavoriteData, null, 0);

                    usercenterService.getFavoriteListByLawID(values.id, function (response) {
                        for (var j = 0; j < response.length; j++) {
                            var flag = false;
                            for (var k = 0; k < $scope.source.length; k++) {
                                if($scope.source[k].id==response[j].id){
                                    flag =true;
                                    break;
                                }
                            }
                            if(flag){
                                $scope.source[k].IsCheck =true;
                            }
                        }
                    })

                })

                $scope.Extend = function (item) {
                    item.Extend = !item.Extend;
                }


            };

            //方法
            var define_function = function () {


                $scope.ok = function () {
                    var lawdata = {
                        id: values.id,
                        favs: []
                    }

                    if ($scope.checkdata.length > 0) {
                        for (var i = 0; i < $scope.checkdata.length; i++) {
                            lawdata.favs.push({ id: $scope.checkdata[i].id });
                        }
                        usercenterService.SaveFavoriteLawsLink(lawdata, function (params) {
                            if (params == 200) {
                                toaster.pop({ type: 'success', body: '收藏成功!' });
                                $modalInstance.dismiss('cancel');
                            }
                        })
                    } else {
                        $modalInstance.dismiss('cancel');
                    }

                }

                $scope.clicktreeNode=function (params) {
                    $scope.treeModel  = params.id;
                } 

                //点击checkbox
                $scope.clickfav = function (item) {
                    if (item.IsCheck) {
                        item.IsCheck = false;
                        deleteData(item);
                    } else {
                        item.IsCheck = true;
                        addData(item)
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