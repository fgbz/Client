define(['bootstrap/app', 'utils', 'app/config-manager', 'services/regulation-service', 'services/technical-service', 'services/system-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('systemSetup-index-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'regulation-service', 'technical-service', 'system-service',
        function ($rootScope, $scope, $state, toaster, $uibModal, regulationService, technicalService, systemService) {



            //变量
            var define_variable = function () {
                $scope.pager = {
                    size: 10,
                    current: 1
                }

                $scope.pagerRole = {
                    size: 10,
                    current: 1
                }

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
                }
                $scope.initReg();

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
                $scope.initTec();

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
                    })
                }
                $scope.initOrg();

                $scope.sfsh = "是";

                $scope.pager.total = 10;
                $scope.clickTreeValue = "11";

                //获取权限列表
                $scope.getRoles = function (isPaging) {
                    $scope.isLoaded = false;

                    //通过当前高度计算每页个数
                    var pagesize = parseInt((window.innerHeight - 200) / 40);

                    if (!isPaging) {
                        $scope.pagerRole.current = 1;
                    }

                    $scope.pagerRole.size = pagesize;

                    var options = {
                        pageNo: $scope.pagerRole.current,
                        pageSize: $scope.pagerRole.size

                    };
                    systemService.getRoles(options, function (response) {
                        $scope.isLoaded = true;
                        $scope.roleItems = response.CurrentList;
                        $scope.pagerRole.total = response.RecordCount;
                    })
                }
                $scope.getRoles();
            };





            $scope.userItems = [
                { Name: "幸德瑞", Gender: "男", Organization: "某某部门一", User: "普通用户" },
                { Name: "白雪", Gender: "女", Organization: "某某部门一", User: "普通用户" },
                { Name: "张小刀", Gender: "男", Organization: "某某部门一", User: "普通用户" },
                { Name: "李季华", Gender: "男", Organization: "某某部门一", User: "普通用户" },
                { Name: "王文文", Gender: "男", Organization: "某某部门一", User: "普通用户" },
                { Name: "谭霞", Gender: "女", Organization: "某某部门一", User: "普通用户" },
                { Name: "绮梦为", Gender: "女", Organization: "某某部门一", User: "普通用户" },
                { Name: "王建军", Gender: "男", Organization: "某某部门一", User: "普通用户" },
                { Name: "黎明", Gender: "男", Organization: "某某部门一", User: "普通用户" }

            ]



            //方法
            var define_function = function () {

                //是否审核
                $scope.clicksfsh = function () {
                    $scope.sfsh = $scope.sfsh == '是' ? '否' : '是';
                }

                $scope.clickTreeBtn = function (item, type) {

                    switch (type) {
                        case 'delete':

                            var data = {
                                id: item.Id,
                                typename: item.EditName,
                                parentid: item.ParentID
                            };

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
                                        parentid: item.ParentID
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
                                            parentid: item.ParentID
                                        }
                                        addOrg(orgdata, tet);
                                    }

                                    break;
                                case 'down':



                                    var data = {
                                        id: '',
                                        typename: $scope.EditName,
                                        parentid: item.Id
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
                                            parentid: item.Id
                                        }
                                        addOrg(orgdata, tet);
                                    }

                                    break;
                                case 'equal':

                                    var data = {
                                        id: '',
                                        typename: $scope.EditName,
                                        parentid: item.ParentID
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
                                            parentid: item.ParentID
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
                    systemService.deleteRoleByID(id, function (res) {
                        $scope.getRoles();
                    })
                }

                //新增角色
                $scope.AddRole = function (params) {
                    var url = 'partials/system/modals/rolemanage.html';
                    var modalInstance = $uibModal.open({

                        templateUrl: url,
                        controller: 'roleManage-controller',
                        size: 600,
                        resolve: {
                            values: function () {

                                var dataRole = {
                                    id:'',
                                    rolename:'',
                                    menus:[]
                                }
                                var data = {
                                    dataRole:dataRole,
                                    Title: '新增',
                                    isCheck:false

                                }
                                return data;
                            }
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