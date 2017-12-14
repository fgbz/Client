define(['bootstrap/app', 'services/role-service'], function (app) {
    'use strict';

    app.controller('role-controller', ['$rootScope', '$scope', '$state', 'role-service', '$uibModal', 'toaster', 'ngDialog', function ($rootScope, $scope, $state, roleService, $modal, toaster, ngDialog) {

        // 代码组织规则：
        // 1、所有在 View 中绑定用到的变量，都在最开始设置初始值。以便于了解有哪些绑定的变量，同时避免没有设置初始值可能引起的问题。

        var numRow = Math.floor((window.innerHeight - 300) / 40)
        var pageSize = numRow > 6 ? numRow : 6;

        // 变量的定义。
        var define_variable = function () {
            $scope.functionList = {};
        };

        var initTable = function () {

            $scope.isLoaded = false;

            var options = {
                //id: node,
                Start: $scope.pager ? $scope.pager.size * ($scope.pager.current - 1) : 0,
                Length: pageSize,
                strSearch: $scope.txtSearch ? $scope.txtSearch : ''
            };
            //alert(JSON.stringify(options))
            roleService.initGetRoles(options).success(function (response) {
                //alert(JSON.stringify(response,0,1))
                $scope.selectNum = true;
                $scope.rolelists = response.Objects;
                $scope.selectNum = 0;
                var count = 0;
                for (var i = 0; i < $scope.rolelists.length; i++) {
                    if ($scope.rolelists[i].Removable) {
                        count++;
                    }
                }

                $scope.secectIsShow = count == 0;
                //alert(JSON.stringify($scope.rolelists));
                $scope.IsAllCheck = false;
                angular.forEach($scope.rolelists, function (value, key) {
                    angular.extend($scope.rolelists[key], { IsCheck: false });
                });
                $scope.pager = {
                    total: response.Total,
                    size: pageSize < response.Total ? pageSize : response.Total,
                    current: $scope.pager ? $scope.pager.current : '1'
                };
                $scope.isLoaded = true;
            });

            roleService.getFunctions().success(function (functionInfo) {
                $scope.functionInfo = functionInfo;
            });

        };

        // 初始化方法。
        var initialize = function () {
            initTable();
        };

        //方法的定义
        var define_function = function () {
            $scope.add = function () {
                $scope.operateName = 'add';
                $scope.editshow = true;

                $scope.roleItemInfo = {
                    "Name": "",
                    "Functions": (function () {
                        var arr = [];

                        $scope.functionList.Functions = angular.copy($scope.functionInfo.Data);
                        $scope.functionList.Functions_title = [];
                        angular.forEach($scope.functionList.Functions, function (value, key) {
                            if (value.Name.indexOf(".") == -1) {
                                $scope.functionList.Functions_title.push(value);
                                value.isChecked = false;
                                angular.extend(value, { 'childItem': [] })
                            }
                            value.isChecked = false;
                            // angular.extend(value, { 'IsChecked': false });

                            // for (var i = 0; i < roleitem.FunctionsList.length; i++) {
                            //     if (value.id == roleitem.FunctionsList[i].key) {
                            //         value.isChecked = true;
                            //         arr.push(roleitem.FunctionsList[i].key);
                            //     }
                            // }
                        })
                        angular.forEach($scope.functionList.Functions, function (value, key) {

                            angular.forEach($scope.functionList.Functions_title, function (item, index) {
                                if (value.Name.indexOf(item.Name + ".") != -1) {
                                    $scope.functionList.Functions_title[index].childItem.push({
                                        Name: value.Name,
                                        isChecked: value.isChecked,
                                        Id: value.Id
                                    });
                                }
                            })

                        });

                        return arr;
                    })()
                };
            };

            $scope.edit = function (roleitem) {
                $scope.operateName = 'edit';
                $scope.editshow = true;

                $scope.roleItemInfo = {
                    'Id': roleitem.Id,
                    'Name': roleitem.Name,
                    'Functions': (function () {
                        var arr = [];

                        $scope.functionList.Functions = angular.copy($scope.functionInfo.Data);
                        $scope.functionList.Functions_title = [];
                        angular.forEach($scope.functionList.Functions, function (value, key) {
                            if (value.Name.indexOf(".") == -1) {
                                $scope.functionList.Functions_title.push(value.Name.split('.')[0]);
                                value.isChecked = false;
                                angular.extend(value, { 'childItem': [] })
                            }
                            // angular.extend(value, { 'IsChecked': false });

                            for (var i = 0; i < roleitem.Functions.length; i++) {
                                if (value.Id == roleitem.Functions[i].key) {
                                    value.isChecked = true;
                                    arr.push(roleitem.Functions[i].key);
                                }
                            }
                        })
                        angular.forEach($scope.functionList.Functions, function (value, key) {

                            angular.forEach($scope.functionList.Functions_title, function (item, index) {
                                if (value.Name.indexOf(item.Name + ".") != -1) {
                                    $scope.functionList.Functions_title[index].childItem.push({
                                        Name: value.Name,
                                        isChecked: value.isChecked,
                                        Id: value.Id
                                    });
                                }
                            })

                        });
                        // console.log(JSON.stringify($scope.Functions,0,1));
                        // console.log(JSON.stringify($scope.Functions_title,0,1));

                        return arr;
                    })()
                }
                //alert(JSON.stringify($scope.roleItemInfo.Functions));
            };

            //提交
            $scope.submit = function (operateName) {
                $scope.roleItemInfo.FunctionIds = [];

                angular.forEach($scope.functionList.Functions, function (value, key) {
                    if (value.isChecked) {
                        if ($.inArray(value.Id, $scope.roleItemInfo.FunctionIds) == -1) {
                            $scope.roleItemInfo.FunctionIds.push(value.Id);
                        }
                    }
                });

                // angular.forEach($scope.functionList.Functions_title, function (value, key) {
                //     if (value.isChecked) {
                //         if ($.inArray(value.Id, $scope.roleItemInfo.Functions) == -1) {
                //             $scope.roleItemInfo.Functions.push(value.Id);
                //         }
                //     }
                //     angular.forEach(value.childItem, function (v, k) {
                //         if (v.isChecked) {
                //             if ($.inArray(v.Id, $scope.roleItemInfo.Functions) == -1) {
                //                 $scope.roleItemInfo.Functions.push(v.Id);
                //             }
                //         }
                //     });
                // })
                if ($scope.roleItemInfo.Name.length > 0 && $scope.roleItemInfo.FunctionIds.length > 0) {
                    if (operateName == 1) {
                        //编辑
                        //alert(JSON.stringify($scope.roleItemInfo));
                        roleService.updateRole($scope.roleItemInfo).success(function (response) {
                            if (response.Code == 1) {
                                $scope.editshow = false;
                                initTable();
                                toaster.pop({ type: 'success', body: '修改成功!' });
                            } else {
                                if (response.Message == '') {
                                    toaster.pop({ type: 'error', body: '修改失败!' });
                                } else {
                                    toaster.pop({ type: 'warning', body: response.Message });
                                }
                            }
                        });
                    }
                    else if (operateName == 2) {
                        //添加
                        //alert(JSON.stringify($scope.roleItemInfo));
                        roleService.insertRole($scope.roleItemInfo).success(function (response) {
                            if (response.Code == 1) {
                                $scope.editshow = false;
                                initTable();
                                toaster.pop({ type: 'success', body: '添加成功!' });
                            } else {
                                if (response.Message == '') {
                                    toaster.pop({ type: 'error', body: '添加失败!' });
                                } else {
                                    toaster.pop({ type: 'warning', body: response.Message });
                                }
                            }
                        });
                    }
                }
                else {
                    if ($scope.roleItemInfo.Name.length == 0) {
                        toaster.pop({ type: 'warning', body: '角色名称不能为空!' });
                    }
                    else if ($scope.roleItemInfo.FunctionIds.length == 0) {
                        toaster.pop({ type: 'warning', body: '功能不能为空!' });
                    }

                }
            };

            //取消
            $scope.cancel = function () {
                $scope.editshow = false;
                $scope.roleItemInfo = {};
            };

            //多选
            var roleSelected = [];
            $scope.checker = function (type, IsAllCheck) {
                if (type == 1) {
                    roleSelected = [];
                    angular.forEach($scope.rolelists, function (value, key) {
                        if (value.Removable) {
                            angular.extend($scope.rolelists[key], { IsCheck: IsAllCheck });
                            var selectitemid = $scope.rolelists[key].Id;
                            roleSelected.push(selectitemid);
                        }
                    });
                    if ($scope.IsAllCheck == false) {
                        roleSelected = [];
                    }
                } else {
                    var totallength = 0;
                    angular.forEach($scope.rolelists, function (value, key) {
                        if (value.Removable) {
                            totallength += 1;
                        }
                    });
                    var checklength = 0;
                    roleSelected = [];
                    angular.forEach($scope.rolelists, function (value, key) {
                        if ($scope.rolelists[key].IsCheck) {
                            checklength += 1;
                        }
                    });

                    if (totallength > 0 && totallength == checklength) {
                        $scope.IsAllCheck = true;
                        var checkbox = document.getElementById("allCheckRole");
                        checkbox.indeterminate = false;
                    } else {
                        $scope.IsAllCheck = false;
                        var checkbox = document.getElementById("allCheckRole");
                        checkbox.indeterminate = true;
                    };

                    if (checklength > 0) {
                        roleSelected = [];
                        for (var i = 0; i < $scope.rolelists.length; i++) {
                            if ($scope.rolelists[i].IsCheck && $scope.rolelists[i].Removable) {
                                roleSelected.push($scope.rolelists[i].Id);
                            }
                        };
                    } else {
                        roleSelected = [];
                    }
                }

                var count = 0;
                angular.forEach($scope.rolelists, function (value, key) {
                    if ($scope.rolelists[key].IsCheck) {
                        count += 1;
                    }
                });
                $scope.selectNum = count;
            };

            //删除岗位
            $scope.deleteRole = function () {
                //alert(JSON.stringify(roleSelected));
                if (roleSelected.length != 0) {
                    // var modal = utils.confirm({ msg: '确定批量删除？', ok: '确定', cancel: '取消' },'sm');
                    // modal.result.then(function () {

                    $scope.text = "确认删除？";
                    ngDialog.openConfirm({
                        templateUrl: 'partials/_confirmModal.html',
                        appendTo: 'body',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope,
                        size: 400,
                        controller: function ($scope) {
                            $scope.ok = function () {
                                roleService.deleteRole(roleSelected).success(function (response) {
                                    if (response.Code == 1) {
                                        $scope.IsAllCheck = false;
                                        roleSelected = [];
                                        initTable($scope.initOrgId);
                                        toaster.pop({ type: 'success', body: '删除成功!' });
                                        $scope.closeThisDialog(); //关闭弹窗
                                    } else {
                                        toaster.pop({ type: 'error', body: '删除失败!' });
                                        $scope.closeThisDialog(); //关闭弹窗
                                    }
                                })
                            };
                            $scope.cancel = function () {
                                $scope.closeThisDialog(); //关闭弹窗
                            }
                        }
                    })

                    // var datas = {
                    //     mes: "确认删除？"
                    // }
                    // var modalInstance = $modal.open({
                    //     templateUrl: 'partials/_confirmModal.html',
                    //     controller: 'confirm-controller',
                    //     size: 400,
                    //     resolve: {
                    //         values: function () {
                    //             return datas;
                    //         }
                    //     }
                    // });

                    // modalInstance.result.then(function (res) {
                    //     if (res) {
                    //         roleService.deleteRole(roleSelected).success(function (response) {
                    //             if (response.Code == 1) {
                    //                 $scope.IsAllCheck = false;
                    //                 roleSelected = [];
                    //                 initTable($scope.initOrgId);
                    //                 toaster.pop({type: 'success', body: '删除成功!'});
                    //             } else {
                    //                 toaster.pop({type: 'error', body: '删除失败!'});
                    //             }
                    //         })
                    //     }
                    // }, function (reason) {
                    //     console.log(reason);//点击空白区域，总会输出backdrop click，点击取消  
                    // });

                    // });


                }
                else {
                    toaster.pop({ type: 'warning', body: '请选择要删除的案件!' });
                }
            };

            //单个删除岗位
            $scope.deleteSingle = function (item) {
                // alert(JSON.stringify(item));
                var data = [item.Id]
                // var modal = utils.confirm({ msg: '确定删除当前岗位吗？', ok: '确定', cancel: '取消' },'sm');
                // modal.result.then(function () {

                $scope.text = "确认删除？";
                ngDialog.openConfirm({
                    templateUrl: 'partials/_confirmModal.html',
                    appendTo: 'body',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope,
                    size: 400,
                    controller: function ($scope) {
                        $scope.ok = function () {
                            roleService.deleteRole(data).success(function (response) {
                                if (response.Code == 1) {
                                    $scope.IsAllCheck = false;
                                    initTable($scope.initOrgId);
                                    toaster.pop({ type: 'success', body: '删除成功!' });
                                    $scope.closeThisDialog(); //关闭弹窗
                                } else {
                                    toaster.pop({ type: 'error', body: '删除失败!' });
                                    $scope.closeThisDialog(); //关闭弹窗
                                }
                            })
                        };
                        $scope.cancel = function () {
                            $scope.closeThisDialog(); //关闭弹窗
                        }
                    }
                })

                // var datas = {
                //     mes: "确认删除？"
                // }
                // var modalInstance = $modal.open({
                //     templateUrl: 'partials/_confirmModal.html',
                //     controller: 'confirm-controller',
                //     size: 400,
                //     resolve: {
                //         values: function () {
                //             return datas;
                //         }
                //     }
                // });

                // modalInstance.result.then(function (res) {
                //     if (res) {
                //         roleService.deleteRole(data).success(function (response) {
                //             if (response.Code == 1) {
                //                 $scope.IsAllCheck = false;
                //                 initTable($scope.initOrgId);
                //                 toaster.pop({type: 'success', body: '删除成功!'});
                //             } else {
                //                 toaster.pop({type: 'error', body: '删除失败!'});
                //             }
                //         })
                //     }
                // }, function (reason) {
                //     console.log(reason);//点击空白区域，总会输出backdrop click，点击取消  
                // });

                // });


            };

            $scope.toggles = function (scope) {

                scope.toggle();
            };

            $scope.enter = function ($event) {
                if ($event.keyCode == 13) {
                    $scope.Paging(true)
                }
            }

            $scope.blur = function () {
                if ($scope.roleItemInfo.Name.length == 0) {
                    document.getElementById("postName").focus();
                    toaster.pop({ type: 'warning', body: '岗位名称不能为空!' });
                }
            }

            //回退键
            $scope.backspace = function ($event) {
                if ($event && $event.keyCode == 8 && $scope.strSearch == '') {
                    $scope.Paging(true)
                }
            }

            //分页切换
            $scope.Paging = function (isSearch) {
                $scope.selectNum = 0;
                roleSelected = [];
                $scope.IsAllCheck = false;
                $scope.isLoaded = false;
                var options = {
                    //id: $scope.initOrgId,
                    Start: isSearch ? 0 : $scope.pager.size * ($scope.pager.current - 1),
                    Length: pageSize,
                    strSearch: $scope.txtSearch
                };
                roleService.initGetRoles(options).success(function (response) {
                    $scope.rolelists = response.Objects;
                    var pager = {
                        total: response.Total,
                        size: pageSize < response.Total ? pageSize : response.Total
                    };
                    if (isSearch) {
                        angular.extend(pager, { current: '1' });
                    }
                    angular.extend($scope.pager, pager);
                    $scope.isLoaded = true;
                });
            };
        };

        // 实际运行……
        define_variable();

        define_function();

        initialize();


    }]);
});