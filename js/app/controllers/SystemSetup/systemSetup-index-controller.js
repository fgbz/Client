define(['bootstrap/app', 'utils', 'app/config-manager', 'services/regulation-service', 'services/technical-service', 'services/system-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('systemSetup-index-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'regulation-service', 'technical-service', 'system-service', 'ngDialog',
        function ($rootScope, $scope, $state, toaster, $uibModal, regulationService, technicalService, systemService, ngDialog) {

            var user = localStorage.getItem("loginUser");

            if (user) {
                user = JSON.parse(user);
            }

            //变量
            var define_variable = function () {

                $scope.pagerRole = {
                    size: 10,
                    current: 1
                }

                $scope.pagerUser = {
                    size: 10,
                    current: 1
                }

                $scope.pagerPublishdep = {
                    size: 10,
                    current: 1
                }
                $scope.userdata = {};
                $scope.systemdata = {};

            };

            //加载
            var initialize = function () {

                $scope.treeData = [

                    { Id: '01', Name: '系统管理', ParentID: null },


                    { Id: '11', Name: '系统审核设置', ParentID: '01' },
                    { Id: '12', Name: '系统邮件服务器设置', ParentID: '01' },

                    { Id: '13', Name: '数据字典管理', ParentID: '01' },
                    { Id: '131', Name: '发布部门管理', ParentID: '13' },
                    { Id: '132', Name: '法规标准执行状态管理', ParentID: '13' },


                    { Id: '14', Name: '权限管理', ParentID: '01' },
                    { Id: '141', Name: '组织机构管理', ParentID: '14' },
                    { Id: '142', Name: '用户管理', ParentID: '14' },
                    { Id: '143', Name: '角色管理', ParentID: '14' },


                    { Id: '15', Name: '法规标准类别维护', ParentID: '01' },
                    { Id: '16', Name: '技术文档类别维护', ParentID: '01' },


                ];


                $scope.sfsh = "是";
                $scope.clickTreeValue = "11";




            };



            //方法
            var define_function = function () {

                //点击左侧系统树
                $scope.clickSystemRootTree = function (params) {
                    switch (params) {

                        case '131':
                            $scope.getpublishdep();
                            break;
                        case '141':
                            $scope.initOrg();
                            break;
                        case '142':
                            if ($scope.treeDataOrg) {
                                $scope.getUsers();
                            } else {
                                $scope.initOrg();
                            }
                            break;
                        case '143':
                            $scope.getRoles();
                            break;
                        case '15':
                            $scope.initReg();
                            break;
                        case '16':
                            $scope.initTec();
                            break;
                        default:
                            break;
                    }
                };

                //初始化发布部门
                $scope.getpublishdep = function (isPaging) {
                    $scope.isLoaded = false;

                    //通过当前高度计算每页个数
                    var pagesize = parseInt((window.innerHeight - 320) / 40);

                    if (!isPaging) {
                        $scope.pagerPublishdep.current = 1;
                    }

                    $scope.pagerPublishdep.size = pagesize;

                    var options = {
                        pageNo: $scope.pagerPublishdep.current,
                        pageSize: $scope.pagerPublishdep.size,
                        conditions: []
                    };
                    if ($scope.systemdata.publishName) {
                        options.conditions.push({ key: 'Name', value: $scope.systemdata.publishName });
                    }

                    systemService.getPublishdepList(options, function (response) {
                        $scope.isLoaded = true;
                        $scope.publishdepItems = response.CurrentList;
                        $scope.pagerPublishdep.total = response.RecordCount;
                    })
                }

                //初始化组织机构
                $scope.initOrg = function () {
                    systemService.getOrganizationList(function (params) {
                        $scope.treeDataOrg = [];

                        for (var i = 0; i < params.length; i++) {
                            var data = {
                                Id: params[i].id,
                                Name: params[i].orgname,
                                ParentID: params[i].parentid,
                                CanDelete: params[i].candelete
                            }
                            $scope.treeDataOrg.push(data);

                        }
                        if (params != null && params.length > 0) {
                            $scope.clickUserValue = params[0].id;
                            $scope.getUsers();
                        }
                    })
                };

                //初始化法规
                $scope.initReg = function () {
                    regulationService.SelectLawstandardType(function (params) {
                        $scope.treeDataReg = [];

                        for (var i = 0; i < params.length; i++) {
                            var data = {
                                Id: params[i].id,
                                Name: params[i].typename,
                                ParentID: params[i].parentid,
                                CanDelete: params[i].candelete
                            }
                            $scope.treeDataReg.push(data);

                        }
                    })
                };

                //初始化技术文件
                $scope.initTec = function () {
                    technicalService.SelectTechnicalType(function (params) {
                        $scope.treeDataTec = [];

                        for (var i = 0; i < params.length; i++) {
                            var data = {
                                Id: params[i].id,
                                Name: params[i].typename,
                                ParentID: params[i].parentid,
                                CanDelete: params[i].candelete
                            }
                            $scope.treeDataTec.push(data);

                        }
                    })
                }

                //获取权限列表
                $scope.getRoles = function (isPaging) {
                    $scope.isLoaded = false;

                    //通过当前高度计算每页个数
                    var pagesize = parseInt((window.innerHeight - 320) / 40);

                    if (!isPaging) {
                        $scope.pagerRole.current = 1;
                    }

                    $scope.pagerRole.size = pagesize;

                    var options = {
                        pageNo: $scope.pagerRole.current,
                        pageSize: $scope.pagerRole.size,
                        conditions: []
                    };
                    if ($scope.userdata.roleName) {
                        options.conditions.push({ key: 'Name', value: $scope.userdata.roleName });
                    }

                    systemService.getRoles(options, function (response) {
                        $scope.isLoaded = true;
                        $scope.roleItems = response.CurrentList;
                        $scope.pagerRole.total = response.RecordCount;
                    })
                }


                //获取用户列表
                $scope.getUsers = function (isPaging) {
                    $scope.isLoaded = false;

                    //通过当前高度计算每页个数
                    var pagesize = parseInt((window.innerHeight - 200) / 40);

                    if (!isPaging) {
                        $scope.pagerUser.current = 1;
                    }

                    $scope.pagerUser.size = pagesize;

                    var options = {
                        pageNo: $scope.pagerUser.current,
                        pageSize: $scope.pagerUser.size,
                        conditions: []
                    };
                    if ($scope.userdata.Name) {
                        options.conditions.push({ key: 'Name', value: $scope.userdata.Name });
                    }
                    if ($scope.clickUserValue) {
                        options.conditions.push({ key: 'TreeValue', value: $scope.clickUserValue });
                    }

                    systemService.getUserList(options, function (response) {
                        $scope.isLoaded = true;
                        $scope.userItems = response.CurrentList;
                        $scope.pagerUser.total = response.RecordCount;
                    })
                }

                //是否审核
                $scope.clicksfsh = function () {
                    $scope.sfsh = $scope.sfsh == '是' ? '否' : '是';
                }

                $scope.clickUsertree = function (params) {
                    $scope.clickUserValue = params;
                    $scope.getUsers();
                }

                $scope.clickTreeBtn = function (item, type) {

                    switch (type) {
                        case 'delete':

                            var data = {
                                id: item.Id,
                                typename: item.EditName,
                                parentid: item.ParentID,
                                inputuserid: user.id,
                                modifyuserid: user.id
                            };

                            $scope.text = "确定删除吗？";
                            var modalInstance = ngDialog.openConfirm({
                                templateUrl: 'partials/_confirmModal.html',
                                appendTo: 'body',
                                className: 'ngdialog-theme-default',
                                showClose: false,
                                scope: $scope,
                                size: 400,
                                controller: function ($scope) {
                                    $scope.ok = function () {

                                        switch ($scope.clickTreeValue) {
                                            case '15':
                                                regulationService.DeleteLawstandardType(data, function (params) {
                                                    if (params == 1) {
                                                        toaster.pop({ type: 'success', body: '删除成功!' });
                                                        $scope.initReg();
                                                    } else {
                                                        toaster.pop({ type: 'danger', body: '删除失败!' });
                                                    }
                                                })
                                                break;
                                            case '16':
                                                technicalService.DeleteTechnicalType(data, function (params) {
                                                    if (params == 1) {
                                                        toaster.pop({ type: 'success', body: '删除成功!' });
                                                        $scope.initTec();
                                                    } else {
                                                        toaster.pop({ type: 'danger', body: '删除失败!' });
                                                    }
                                                })
                                                break;
                                            case '141':
                                                systemService.DeleteOrganization(data, function (params) {
                                                    if (params == 1) {
                                                        toaster.pop({ type: 'success', body: '删除成功!' });
                                                        $scope.initOrg();
                                                    } else {
                                                        toaster.pop({ type: 'danger', body: '删除失败!' });
                                                    }
                                                })

                                                break;
                                            default:
                                                break;
                                        }

                                        $scope.closeThisDialog(); //关闭弹窗
                                    };
                                    $scope.cancel = function () {
                                        $scope.closeThisDialog(); //关闭弹窗
                                    }
                                }
                            });




                            break;
                        case 'edit':
                            ShowEdit(item, '编辑', type);
                            break;
                        case 'down':
                            ShowEdit(item, '新增下级', type);
                            break;
                        case 'equal':
                            ShowEdit(item, '新增同级', type);
                            break;

                        default:
                            break;
                    }
                }

                var ShowEdit = function (item, title, type) {

                    var url = 'partials/system/modals/treeEdit.html';
                    var modalInstance = $uibModal.open({

                        templateUrl: url,
                        controller: 'treeEdit-controller',
                        size: 600,
                        resolve: {
                            values: function () {
                                var data = {
                                    Name: type == 'edit' ? item.Name : '',
                                    Title: title
                                }
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (res) {
                        if (res) {
                            $scope.EditName = res;

                            switch (type) {
                                case 'edit':

                                    var data = {
                                        id: item.Id,
                                        typename: $scope.EditName,
                                        parentid: item.ParentID,
                                        inputuserid: user.id,
                                        modifyuserid: user.id
                                    }
                                    var tet = '编辑';

                                    if ($scope.clickTreeValue == '15') {
                                        addReg(data, tet);
                                    } else if ($scope.clickTreeValue == '16') {
                                        addTec(data, tet);
                                    } else {
                                        var orgdata = {
                                            id: item.Id,
                                            orgname: $scope.EditName,
                                            parentid: item.ParentID,
                                            inputuserid: user.id,
                                            modifyuserid: user.id
                                        }
                                        addOrg(orgdata, tet);
                                    }

                                    break;
                                case 'down':



                                    var data = {
                                        id: '',
                                        typename: $scope.EditName,
                                        parentid: item.Id,
                                        inputuserid: user.id,
                                        modifyuserid: user.id
                                    }

                                    var tet = '新增下级';

                                    if ($scope.clickTreeValue == '15') {
                                        addReg(data, tet);
                                    } else if ($scope.clickTreeValue == '16') {
                                        addTec(data, tet);
                                    } else {
                                        var orgdata = {
                                            id: '',
                                            orgname: $scope.EditName,
                                            parentid: item.Id,
                                            inputuserid: user.id,
                                            modifyuserid: user.id
                                        }
                                        addOrg(orgdata, tet);
                                    }

                                    break;
                                case 'equal':

                                    var data = {
                                        id: '',
                                        typename: $scope.EditName,
                                        parentid: item.ParentID,
                                        inputuserid: user.id,
                                        modifyuserid: user.id
                                    }

                                    var tet = '新增同级';

                                    if ($scope.clickTreeValue == '15') {
                                        addReg(data, tet);
                                    } else if ($scope.clickTreeValue == '16') {
                                        addTec(data, tet);
                                    } else {
                                        var orgdata = {
                                            id: '',
                                            orgname: $scope.EditName,
                                            parentid: item.ParentID,
                                            inputuserid: user.id,
                                            modifyuserid: user.id
                                        }
                                        addOrg(orgdata, tet);
                                    }


                                    break;

                                default:
                                    break;
                            }
                        }
                    });
                }

                //新增或编辑法律标准
                function addReg(data, txt) {
                    regulationService.AddOrUpdateLawstandardType(data, function (params) {
                        if (params == 1) {
                            toaster.pop({ type: 'success', body: txt + '成功!' });
                            $scope.initReg();
                        } else {
                            toaster.pop({ type: 'danger', body: txt + '失败!' });
                        }
                    })
                }

                //新增技术文档
                function addTec(data, txt) {
                    technicalService.AddOrUpdateTechnicalType(data, function (params) {
                        if (params == 1) {
                            toaster.pop({ type: 'success', body: txt + '成功!' });
                            $scope.initTec();
                        } else {
                            toaster.pop({ type: 'danger', body: txt + '失败!' });
                        }
                    })
                }

                //新增组织机构
                function addOrg(data, txt) {
                    systemService.AddOrUpdateOrganizationType(data, function (params) {
                        if (params == 1) {
                            toaster.pop({ type: 'success', body: txt + '成功!' });
                            $scope.initOrg();
                        } else {
                            toaster.pop({ type: 'danger', body: txt + '失败!' });
                        }
                    })
                }


                /*****************************角色**************************** */
                $scope.DeleteRole = function (id) {

                    $scope.text = "确定删除吗？";
                    var modalInstance = ngDialog.openConfirm({
                        templateUrl: 'partials/_confirmModal.html',
                        appendTo: 'body',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope,
                        size: 400,
                        controller: function ($scope) {
                            $scope.ok = function () {

                                systemService.deleteRoleByID(id, function (res) {
                                    $scope.getRoles();
                                })

                                $scope.closeThisDialog(); //关闭弹窗
                            };
                            $scope.cancel = function () {
                                $scope.closeThisDialog(); //关闭弹窗
                            }
                        }
                    });


                }

                //新增，查看，编辑角色
                $scope.ShowRole = function (item, flag, txt) {
                    var url = 'partials/system/modals/rolemanage.html';
                    var modalInstance = $uibModal.open({

                        templateUrl: url,
                        controller: 'roleManage-controller',
                        size: 600,
                        resolve: {
                            values: function () {

                                var dataRole = {
                                    id: '',
                                    rolename: '',
                                    inputuserid: user.id,
                                    modifyuserid: user.id,
                                    menus: []
                                }
                                if (item != null) {
                                    dataRole = item;
                                    dataRole.modifyuserid = user.id;
                                }
                                var data = {
                                    dataRole: dataRole,
                                    Title: txt,
                                    isCheck: flag

                                }
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (res) {
                        if (res) {
                            systemService.SaveOrEditRole(res, function (params) {
                                if (params == 1) {
                                    toaster.pop({ type: 'success', body: txt + '成功!' });
                                    $scope.getRoles();
                                } else {
                                    toaster.pop({ type: 'danger', body: txt + '失败!' });
                                }
                            })

                        }
                    });

                }


                /*****************************用户**************************** */
                $scope.DeleteUser = function (item) {

                    $scope.text = "确定删除吗？";
                    var modalInstance = ngDialog.openConfirm({
                        templateUrl: 'partials/_confirmModal.html',
                        appendTo: 'body',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope,
                        size: 400,
                        controller: function ($scope) {
                            $scope.ok = function () {

                                systemService.deleteUserByID(item, function (res) {

                                    $scope.getUsers();
                                })

                                $scope.closeThisDialog(); //关闭弹窗
                            };
                            $scope.cancel = function () {
                                $scope.closeThisDialog(); //关闭弹窗
                            }
                        }
                    });

                }

                //新增，查看，用户
                $scope.ShowUser = function (item, flag, txt) {
                    var url = 'partials/system/modals/usermanage.html';
                    var modalInstance = $uibModal.open({

                        templateUrl: url,
                        controller: 'userManage-controller',
                        size: 600,
                        resolve: {
                            values: function () {

                                var dataUser = {
                                    id: '',
                                    inputuserid: user.id,
                                    lastmodifyuserid: user.id,
                                    orgid: $scope.clickUserValue,
                                    roles: []
                                }
                                if (item != null) {
                                    dataUser = item;
                                    dataUser.lastmodifyuserid = user.id
                                }
                                var data = {
                                    dataUser: dataUser,
                                    Title: txt,
                                    isCheck: flag

                                }
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (res) {
                        if (res) {
                            $scope.getUsers();

                        }
                    });

                }


                /*****************************发布部门**************************** */
                $scope.DeletePublishdep = function (item) {

                    $scope.text = "确定删除吗？";
                    var modalInstance = ngDialog.openConfirm({
                        templateUrl: 'partials/_confirmModal.html',
                        appendTo: 'body',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope,
                        size: 400,
                        controller: function ($scope) {
                            $scope.ok = function () {

                                systemService.DeletePublishdepByID(item, function (res) {

                                    $scope.getpublishdep();
                                })

                                $scope.closeThisDialog(); //关闭弹窗
                            };
                            $scope.cancel = function () {
                                $scope.closeThisDialog(); //关闭弹窗
                            }
                        }
                    });

                }

                //新增，编辑，用户
                $scope.ShowPublishdep = function (item, flag, txt) {
                    var url = 'partials/system/modals/treeEdit.html';
                    var modalInstance = $uibModal.open({

                        templateUrl: url,
                        controller: 'treeEdit-controller',
                        size: 600,
                        resolve: {
                            values: function () {
                                var data = {
                                    Name: item != null ? item.pubdepname : '',
                                    Title: txt
                                }
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (res) {
                        if (res) {
                            var dataPublishdep = {
                                id: '',
                                pubdepname: res,
                                inputuserid: user.id,
                                modifyuserid: user.id
                            }
                            if (item != null) {
                                dataPublishdep.id = item.id;
                            }
                            systemService.SaveOrUpdatePublishdep(dataPublishdep, function (params) {
                                if (params == 200) {
                                    toaster.pop({ type: 'success', body: txt + '成功!' });
                                    $scope.getpublishdep();
                                } else if (params == 461) {
                                    toaster.pop({ type: 'danger', body: '用户名重复!', timeout: 0 });
                                } else {
                                    toaster.pop({ type: 'danger', body: txt + '失败!' });
                                }
                            })

                        }
                    });

                }

            };

            // 实际运行……
            define_variable();

            initialize();

            define_function();


        }]);
});