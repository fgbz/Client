define(['bootstrap/app', 'utils', 'services/regulation-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('reference-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', '$uibModalInstance', 'regulation-service', 'values', 'ngDialog',
        function ($rootScope, $scope, $state, toaster, $uibModal, $modalInstance, regulationService, values, ngDialog) {

            var user = sessionStorage.getItem('loginUser');
            if (user) {
                user = JSON.parse(user);
                $scope.user = user;
            }

            $scope.isLawMaintain = utils.getListItem('法规发布维护', 'menuname', user.menus);

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

                if (values.redata && values.redata.length > 0) {
                    $scope.data = values.redata;
                }


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

                    $scope.pager.size = $scope.PageSize;

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

                    if ($scope.ApproveStatus) {
                        options.conditions.push({ key: 'ApproveStatus', value: $scope.ApproveStatus });
                    }


                    regulationService.getReplaceLawstandardList(options, function (response) {
                        $scope.isLoaded = true;
                        $scope.items = response.CurrentList;

                        angular.forEach($scope.items, function (value, key) {

                            var flag = false;
                            for (var i = 0; i < $scope.data.length; i++) {
                                if ($scope.data[i].id == value.id) {
                                    flag = true;
                                    break;
                                }

                            }
                            if (flag) {
                                angular.extend($scope.items[key], { IsCheck: true });
                            } else {
                                angular.extend($scope.items[key], { IsCheck: false });
                            }


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

                $scope.okref = function () {
                    if ($scope.title == "代替关系") {
                        if ($scope.data.length > 0) {
                            var code = "";
                            for (var i = 0; i < $scope.data.length; i++) {
                                code += $scope.data[i].code + ",";
                            }
                            $scope.text = "本条标准将代替" + code + "被代替标准状态将将改为“作废”，是否确认？";
                            var modalInstance = ngDialog.openConfirm({
                                templateUrl: 'partials/_confirmModal.html',
                                appendTo: 'body',
                                className: 'ngdialog-theme-default',
                                showClose: false,
                                scope: $scope,
                                closeByDocument: false,
                                size: 400,
                                controller: function ($scope) {
                                    $scope.ok = function () {
                                        $scope.closeThisDialog();
                                        $modalInstance.close($scope.data);
                                    };
                                    $scope.cancel = function () {
                                        $scope.closeThisDialog(); //关闭弹窗
                                    }
                                }
                            });
                        } else {
                            $modalInstance.close($scope.data);
                        }
                    } else {
                        $modalInstance.close($scope.data);
                    }

                }

                $scope.cancelref = function () {
                    $modalInstance.dismiss('cancel');
                };


                //新增编辑临时法规
                $scope.Add = function (item, type) {

                    var url = 'partials/system/modals/addReplaceOrReference.html';
                    var modalInstance = $uibModal.open({

                        templateUrl: url,
                        controller: 'addReplaceOrReference-controller',
                        size: 600,
                        backdrop: 'static',
                        resolve: {
                            values: function () {
                                var data = {
                                    id: '',
                                    chinesename: '',
                                    code: '',
                                    isEdit: type
                                }
                                if (item) {
                                    data.id = item.id;
                                    data.chinesename = item.chinesename;
                                    data.code = item.code;
                                }

                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (res) {
                        if (res == 200) {
                            $scope.search();
                        }
                    }, function (reason) { }

                    );
                }

                //删除临时法规
                $scope.DeleteReplece = function (id) {
                    regulationService.DeleteReplece(id, function (res) {
                        if (res == 200) {
                            toaster.pop({ type: 'success', body: '删除成功!', timeout: 5000 });
                            $scope.search();
                        } else {
                            toaster.pop({ type: 'danger', body: '删除失败!', timeout: 5000 });
                        }
                    })
                }


            };

            // 实际运行……
            define_variable();

            initialize();

            define_function();


        }]);
});