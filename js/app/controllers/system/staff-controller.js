define(['bootstrap/app', 'services/organization-manager-service', 'services/staff-manager-service', 'services/role-service', 'utilities/cryto', 'services/authorization-service'], function (app) {
    'use strict';

    var cryto = require('utilities/cryto');

    app.controller('staff-controller', ['$rootScope', '$scope', '$state', 'organization-manager-service', '$uibModal', 'staff-manager-service', 'role-service', 'defaultPassword', 'toaster', 'ngDialog', 'authorization-service', function ($rootScope, $scope, $state, organizationService, $modal, staffService, roleService, defaultPassword, toaster, ngDialog, authService) {

        // 代码组织规则：
        // 1、所有在 View 中绑定用到的变量，都在最开始设置初始值。以便于了解有哪些绑定的变量，同时避免没有设置初始值可能引起的问题。

        var rootParentId = '00000000-0000-0000-0000-000000000000', tempData;
        var numRow = Math.floor((window.innerHeight - 260) / 40)
        var pageSize = numRow > 6 ? numRow : 6;
        var staffTotalNum = 0;
        var accounts = [];
        // 代码组织规则：
        // 1、所有在 View 中绑定用到的变量，都在最开始设置初始值。以便于了解有哪些绑定的变量，同时避免没有设置初始值可能引起的问题。

        // 变量的定义。
        var define_variable = function () {

        };

        // 初始化方法。
        var initialize = function () {
            //init tree
            // organizationService.getTreeParent().success(function (result) {
            var treeNodes = JSON.parse(localStorage.getItem('treeParent'));

            tempData = treeNodes;
            //alert(JSON.stringify(result,0,1))
            $scope.data = treeNodes;

            $scope.dropDowntreeData = angular.copy(treeNodes);
            //table isLoaded
            $scope.isLoaded = false;
            //isEditOrAdd
            $scope.isEdit = false;
            //selected posts
            $scope.Posts = [];
            //init table
            //firsttime loading 
            $scope.initTableById($scope.data[0], true);
            // });
        };

        //方法的定义
        var define_function = function () {
            //Checkbox
            $scope.checker = function (type, IsAllCheck) {
                if (type == 1) {
                    angular.forEach($scope.items, function (value, key) {
                        angular.extend($scope.items[key], { IsCheck: IsAllCheck });
                    });
                } else {
                    var totallength = $scope.items.length;
                    var checklength = 0;
                    angular.forEach($scope.items, function (value, key) {
                        if ($scope.items[key].IsCheck) {
                            checklength += 1;
                        }
                    });
                    if (totallength > 0 && totallength == checklength) {
                        $scope.IsAllCheck = true;
                    } else {
                        $scope.IsAllCheck = false;
                        //  $scope.$element.attr('indeterminate',true); 
                    }
                }
                var count = 0;
                angular.forEach($scope.items, function (value, key) {
                    if ($scope.items[key].IsCheck) {
                        count += 1;
                    }
                });
                $scope.selectNum = count;
            };
            //dropDownTree click
            $scope.initRolesById = function (node, Roles) {
                $scope.initRoleNode = node;
                // if (node.type == 2) {
                $scope.Roles = [];
                $scope.UserModel.DepartmentId = node.id;
                $scope.UserModel.DepartmentName = node.title;
                roleService.GetAllRoles().success(function (res) {
                    $scope.Roles = res.Data;
                    angular.forEach($scope.Roles, function (value, key) {
                        if (Roles) {
                            //alert(JSON.stringify(Roles,0,1))
                            for (var i = 0; i < Roles.length; i++) {
                                if (Roles[i].key == value.Id) {
                                    angular.extend(value, { 'IsChecked': true });
                                }
                            }
                        } else {
                            angular.extend(value, { 'IsChecked': false });
                        }

                    });

                });
                // } else {
                //     return;
                // }
            };

            $scope.clickNode = function (node) {
                //console.log(JSON.stringify(node,0,1));
                if (node.type == 2) {
                    $scope.initRoleNode = node;
                    $scope.UserModel.DepartmentId = node.id;
                    $scope.UserModel.DepartmentName = node.title;
                }
            }

            //init staff list
            $scope.initTableById = function (nodes, isFirst) {
                var node = {};

                if (nodes) {
                    node = nodes;
                }

                $scope.initRoleNode = node;
                //alert(JSON.stringify(node)+11)
                if (node.type == 1) {
                    $scope.isAddShow = true;
                } else {
                    $scope.isAddShow = false;
                }
                $scope.isLoaded = false;
                $scope.initNode = node;
                $scope.selectedNode = nodes;
                $scope.initNodeAll = nodes;
                var options = {
                    id: node.id,
                    type: node.type,
                    Start: 0,//$scope.pager ? $scope.pager.size * ($scope.pager.current - 1) : 0,
                    Length: pageSize,
                    strSearch: $scope.strSearch ? $scope.strSearch : ''
                };
                staffService.initTableById(options).success(function (response) {
                    //alert(JSON.stringify(response,0,3));
                    if (response.Total > staffTotalNum) {
                        staffTotalNum = response.Total;
                    }
                    $scope.items = response.Objects;
                    //默认不选中
                    $scope.IsAllCheck = false;
                    $scope.selectNum = 0;
                    angular.forEach($scope.items, function (value, key) {
                        angular.extend($scope.items[key], { IsCheck: false });
                    });
                    $scope.pager = {
                        total: response.Total,
                        size: pageSize < response.Total ? pageSize : response.Total,
                        current: '1'//$scope.pager ? $scope.pager.current : '1'
                    };
                    $scope.isLoaded = true;
                });
            };

            $scope.ShowForm = function (item) {
                //获取所有用户的账号信息
                getAllStaffAccount($scope.data[0])

                $scope.selectdep = false;
                $scope.Roles = [];
                $scope.isEdit = true;
                if (item == null) {
                    //add
                    $scope.imageSrc = '';
                    $scope.isAddPic = "add";
                    // $scope.isOrgEdit = false;
                    $scope.UserModel = {
                        "Name": "",
                        "Account": "",
                        "DepartmentId": $scope.initNode.type == 2 ? $scope.initNode.id : '',
                        "DepartmentName": $scope.initNode.type == 2 ? $scope.initNode.title : '',
                        "Roles": (function () {
                            var arr = [];
                            return arr;
                        })()
                    };
                    var t = {};
                    if ($scope.initNode.type == 2) {
                        t = {
                            id: $scope.initNode.id,
                            //organizationId: $scope.initNode.organizationId,
                            title: $scope.initNode.title,
                            type: 2
                        }
                        $scope.initRolesById(t, null);
                    } else {
                        var depNodes = [];
                        if ($scope.selectedNode.nodes.length == 0) {
                            if ($scope.selectedNode.value > 0) {
                                organizationService.getTreeChild($scope.initNode.id).success(function (res) {
                                    angular.forEach(res.Data, function (v, k) {
                                        if (v.type == 2) {
                                            depNodes.push(v);
                                        }
                                    });
                                    if (depNodes.length == 0) {
                                        //自动生成部门
                                        addDepartment();
                                    } else {
                                        t = {
                                            id: depNodes[0].id,
                                            //organizationId: depNodes[0].organizationId,
                                            title: depNodes[0].title,
                                            type: 2
                                        }
                                        $scope.initRolesById(t, null);
                                    }
                                })
                            } else {
                                //自动生成部门
                                addDepartment();
                            }

                        } else {
                            angular.forEach($scope.initNode.nodes, function (v, k) {
                                if (v.type == 2) {
                                    depNodes.push(v)
                                }
                            });
                            if (depNodes.length == 0) {
                                //自动生成部门
                                addDepartment();
                            } else {
                                t = {
                                    id: depNodes[0].id,
                                    //organizationId: depNodes[0].organizationId,
                                    title: depNodes[0].title,
                                    type: 2
                                }
                                $scope.initRolesById(t, null);
                            }
                        }
                    }
                    // $scope.initRolesById(t,null);
                } else {
                    //edit
                    // $scope.imageSrc=hostAddress+'/staff/GetPhotograph?id='+item.Id+'&t='+new Date().getTime();
                    $scope.isAddPic = "edit";
                    $scope.selectdep = false;
                    //$scope.isOrgEdit = true;
                    $scope.UserModel = {
                        "Id": item.Id,
                        "Name": item.Name,
                        "Account": item.Account,
                        "DepartmentId": item.Department.key,
                        "DepartmentName": item.Department.value,
                        "Roles": (function () {
                            var arr = [];
                            angular.forEach($scope.Roles, function (value, key) {
                                for (var i = 0; i < item.Roles.length; i++) {
                                    if (value.Id == item.Roles[i].key) {
                                        value.IsChecked = true;
                                        arr.push(item.Roles[i].key);
                                    }
                                }
                            });
                            return arr;
                        })(),
                    };

                    //loading initRolesById
                    var loadingRoles = function () {
                        var orgid = '';
                        var getOrganizationByDeparmentId = function (id) {
                            for (var k = 0; k < tempData.length; k++) {
                                if (tempData[k].id == id) {
                                    if (tempData[k].type == 1) {
                                        orgid = tempData[k].id;
                                        return;
                                    } else {
                                        var parentId = tempData[k].key.parentOId;
                                        getOrganizationByDeparmentId(parentId);
                                    }
                                }
                            }
                        };
                        getOrganizationByDeparmentId(item.Department.key);
                        var t = {
                            id: item.Department.key,
                            title: item.Department.value,
                            //organizationId: orgid,
                            type: 2
                        }
                        $scope.initRolesById(t, item.Roles);
                    };
                    loadingRoles();
                    // $scope.uploader.url=hostAddress+'/Staff/UpdateStaffPhotograph?id='+$scope.UserModel.Id+'&t='+new Date().getTime();
                }

            };

            $scope.toggles = function (scope) {
                var nodePair = scope.$nodeScope.$modelValue;
                if (nodePair.nodes.length == 0) {
                    if (nodePair.type == 1) {
                        organizationService.getTreeChild(nodePair.id).success(function (res) {
                            //angular.extend(res.Data, $scope.data[0]);

                            getSelectNode($scope.data, nodePair, res.Data);

                            tempData = $scope.data;

                            $scope.dropDowntreeData = angular.copy($scope.data);
                            scope.toggle();
                        })
                    }
                    else {
                        organizationService.getTreeChildDep(nodePair.id).success(function (res) {
                            //angular.extend(res.Data, $scope.data[0]);

                            getSelectNode($scope.data, nodePair, res.Data);

                            tempData = $scope.data;

                            $scope.dropDowntreeData = angular.copy($scope.data);
                            //scope.toggle();
                        })
                    }
                }
                else {
                    scope.toggle();
                }

                // $scope.isAdd=scope.$modelValue.id;

            };
            $scope.toggles2 = function (scope) {
                var nodePair = scope.$nodeScope.$modelValue;
                if (nodePair.nodes.length == 0) {
                    if (nodePair.type == 1) {
                        organizationService.getTreeChild(nodePair.id).success(function (res) {
                            //angular.extend(res.Data, $scope.data[0]);
                            tempData = $scope.dropDowntreeData;
                            getSelectNode($scope.dropDowntreeData, nodePair, res.Data);
                            scope.toggle();
                        })
                    }
                    else {
                        organizationService.getTreeChildDep(nodePair.id).success(function (res) {
                            //angular.extend(res.Data, $scope.data[0]);

                            getSelectNode($scope.data, nodePair, res.Data);

                            tempData = $scope.data;

                            $scope.dropDowntreeData = angular.copy($scope.data);
                            //scope.toggle();
                        })
                    }
                }
                else {
                    scope.toggle();
                }
            };

            //返回/取消
            $scope.Back = function () {
                //  uploader.clearQueue();
                $scope.time = new Date().getTime();
                $scope.isEdit = false;
            }


            $scope.Submit = function () {
                if ($scope.UserModel.Name.length > 0 && $scope.UserModel.DepartmentId.length > 0 && $scope.UserModel.Account.length > 0) {
                    var isAccount = false;
                    angular.forEach(accounts, function (value, key) {
                        if (value == $scope.UserModel.Account) {
                            isAccount = true;
                        }
                    });
                    $scope.UserModel.RoleIds = [];
                    // if(!isAccount){
                    angular.forEach($scope.Roles, function (value, key) {
                        if (value.IsChecked) {
                            $scope.UserModel.RoleIds.push(value.Id);
                        }
                    });

                    staffService.insertOrUpdateStaff($scope.UserModel).success(function (res) {
                        if (res.Code == 1) {
                            // uploader.clearQueue();
                            $scope.isEdit = false;
                            $scope.time = new Date().getTime();
                            //alert(JSON.stringify($scope.initNodeAll,0,4))
                            //$scope.initTableById($scope.initNodeAll);
                            $scope.Paging();
                            if ('Id' in $scope.UserModel) {
                                // uploader.queue[uploader.queue.length-1].upload();
                                toaster.pop({ type: 'success', body: '修改成功!' });
                            }
                            else {
                                toaster.pop({ type: 'success', body: '添加成功!' });
                            }

                        } else {
                            if ('Id' in $scope.UserModel) {
                                // uploader.queue[uploader.queue.length-1].upload();
                                if (isAccount) {
                                    toaster.pop({ type: 'error', body: '登录账号已存在,修改失败!' });
                                } else {
                                    toaster.pop({ type: 'error', body: '修改失败!' });
                                }
                            }
                            else {
                                if (isAccount) {
                                    toaster.pop({ type: 'error', body: '登录账号已存在,添加失败!' });
                                }
                                else {
                                    toaster.pop({ type: 'error', body: '添加失败!' });
                                }
                            }
                        }
                    });
                    // }else{
                    //     $scope.$parent.alertMessage('warning', '登陆账号已存在');
                    // }

                }
                else {
                    if ($scope.UserModel.Name.length == 0) {
                        // document.getElementById("stuffName").focus();
                        toaster.pop({ type: 'warning', body: '姓名不能为空!' });
                    }
                    else {
                        if ($scope.UserModel.DepartmentId.length == 0) {
                            toaster.pop({ type: 'warning', body: '部门不能为空!' });
                        }
                        else {
                            if ($scope.UserModel.Account.length == 0) {
                                toaster.pop({ type: 'warning', body: '登录账号不能为空!' });
                            }
                        }
                    }

                }
            };

            $scope.DeleteStaff = function (userId) {
                // var modal = utils.confirm({ msg: '确定删除当前人员吗？', ok: '确定', cancel: '取消' },'sm');
                // modal.result.then(function () {
                var data = [];
                data.push(userId);

                $scope.text = "确认删除？";
                var modalInstance = ngDialog.openConfirm({
                    templateUrl: 'partials/_confirmModal.html',
                    appendTo: 'body',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope,
                    size: 400,
                    controller: function ($scope) {
                        $scope.ok = function () {
                            staffService.deleteStaff(data).success(function (res) {
                                if (res.Code == 1) {
                                    //$scope.initTableById($scope.initNodeAll);
                                    $scope.Paging();
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
            };

            $scope.deleteAllStuff = function () {
                var data = [];
                angular.forEach($scope.items, function (value, key) {
                    if ($scope.items[key].IsCheck) {
                        data.push($scope.items[key].Id)
                    }
                });

                $scope.text = "确认批量删除？";
                var modalInstance = ngDialog.openConfirm({
                    templateUrl: 'partials/_confirmModal.html',
                    appendTo: 'body',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope,
                    size: 400,
                    controller: function ($scope) {
                        $scope.ok = function () {
                            staffService.deleteStaff(data).success(function (res) {
                                if (res.Code == 1) {
                                    //$scope.initTableById($scope.initNodeAll);
                                    $scope.Paging();
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
            }

            $scope.enter = function ($event) {
                if ($event.keyCode == 13) {
                    $scope.Paging(true);
                }
            }

            //回退键
            $scope.backspace = function ($event) {
                if ($event && $event.keyCode == 8 && $scope.strSearch == '') {
                    $scope.Paging(true);
                }
            }

            $scope.Paging = function (isSearch) {
                $scope.selectNum = 0;
                $scope.isLoaded = false;
                $scope.IsAllCheck = false;
                var options = {
                    id: $scope.initNode.id,
                    type: $scope.initNode.type,
                    Start: isSearch ? 0 : $scope.pager.size * ($scope.pager.current - 1),
                    Length: pageSize,
                    strSearch: $scope.strSearch
                };
                staffService.initTableById(options).success(function (response) {
                    //alert(JSON.stringify(response,0,3));
                    $scope.items = response.Objects;
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


            $scope.blur = function () {
                if ($scope.UserModel.Name.length == 0) {
                    document.getElementById("stuffName").focus();
                    toaster.pop({ type: 'warning', body: '姓名不能为空!' });
                }
            }

            //updatePassword
            $scope.updatePassword = function (id, account) {
                // var dataObject = {
                //     "StaffId": id,
                //     "oldPassword": '',
                //     "newPassword": '',
                //     "Password": ''
                // }
                // var modalInstance = $modal.open({
                //     templateUrl: 'partials/_updatePasswordModal.html',
                //     controller: 'updatePassword-controller',
                //     size: 400,
                //     resolve: {
                //         values: function () {
                //             return dataObject;
                //         }
                //     }
                // });

                // modalInstance.result.then(function (res) {
                var data = {
                    "staffId": id,//res.StaffId,
                    //重置密码应该与用户名一致
                    // "Password": cryto.getSHA256(account),//cryto.getSHA256(defaultPassword),//cryto.getSHA256('8888888'),
                    // "OldPassword": '',//cryto.getSHA256(res.oldPassword)
                    // "IsUpdatePassword": false//重置密码
                }
                authService.ResetPassword(data).success(function (response) {
                    if (response.Code == 1) {
                        toaster.pop({ type: 'success', body: '重置成功!' });
                    } else {
                        toaster.pop({ type: 'error', body: '重置失败!' });
                    }
                })
                // }, function (reason) {
                //     console.log(reason);//点击空白区域，总会输出backdrop click，点击取消  
                // });
            }
        }

        var getAllStaffAccount = function (node) {
            var options = {
                id: node.id,
                type: node.type,
                Start: 0,
                Length: staffTotalNum
            };
            staffService.initTableById(options).success(function (response) {
                // alert(JSON.stringify(response,0,3));
                angular.forEach(response.Objects, function (value, key) {
                    accounts.push(value.Account);
                })
            });
        }

        var updateNode = function (treeNode, node, childNode) {
            //alert()
            angular.forEach(treeNode, function (value, key) {
                //alert(key);
                //alert(JSON.stringify(value,0,1))
                if (node.id == value.id) {
                    value.nodes = childNode;
                    value.value = childNode.length;
                }
                else {
                    updateNode(value.nodes, node, childNode);
                }
            });
        }

        //添加和删除组织部门 时 获取修改的部分
        var updateTreeNode = function (data, id) {
            if ($scope.selectedNode.type == 1) {
                organizationService.getTreeChild($scope.selectedNode.id).success(function (res) {
                    //angular.extend(res.Data, $scope.data[0]);

                    updateNode($scope.data, $scope.selectedNode, res.Data);

                    tempData = $scope.data;

                    $scope.dropDowntreeData = angular.copy(tempData);

                    var t = {
                        id: id,
                        organizationId: data.organizationId,
                        title: data.title,
                        type: 2
                    }
                    $scope.initRolesById(t, null);

                })
            }
            else {
                organizationService.getTreeChildDep($scope.selectedNode.id).success(function (res) {
                    //angular.extend(res.Data, $scope.data[0]);

                    updateNode($scope.data, $scope.selectedNode, res.Data);

                    tempData = $scope.data;
                })
            }
        };

        //自动生成部门
        var addDepartment = function (isOpen) {
            var data = {
                type: 2,
                title: '信息中心',
                parentId: '00000000-0000-0000-0000-000000000000',
                organizationId: $scope.selectedNode.id
            }
            organizationService.insertTreeNode(data).success(function (res) {
                if (res.Code == 1) {
                    updateTreeNode(data, res.Message);
                }
                else {

                }
            });
        }

        var getSelectNode = function (treeNode, node, childNode) {
            //alert()
            angular.forEach(treeNode, function (value, key) {
                //alert(key);
                //alert(JSON.stringify(value,0,1))
                if (node.id == value.id) {
                    for (var i = 0; i < childNode.length; i++) {
                        value.nodes.push(childNode[i]);
                    }
                }
                else {
                    getSelectNode(value.nodes, node, childNode);
                }
            });
        }

        // 实际运行……
        define_variable();

        define_function();

        initialize();

    }]);
});