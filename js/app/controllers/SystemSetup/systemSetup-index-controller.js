define(['bootstrap/app', 'utils', 'app/config-manager', 'services/regulation-service', 'services/technical-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('systemSetup-index-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'regulation-service', 'technical-service',
        function ($rootScope, $scope, $state, toaster, $uibModal, regulationService, technicalService) {



            //变量
            var define_variable = function () {
                $scope.pager = {
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
                    { Id: '13', Name: '组织机构管理', ParentID: '01' },




                    { Id: '14', Name: '数据字典管理', ParentID: '01' },
                    { Id: '141', Name: '发布部门管理', ParentID: '14' },
                    { Id: '142', Name: '法规标准执行状态管理', ParentID: '14' },


                    { Id: '15', Name: '权限管理', ParentID: '01' },

                    { Id: '151', Name: '职责设置', ParentID: '15' },
                    { Id: '152', Name: '角色设置', ParentID: '15' },
                    { Id: '153', Name: '角色授权', ParentID: '15' },
                    { Id: '154', Name: '用户设置', ParentID: '15' },
                    { Id: '155', Name: '用户授权', ParentID: '15' },

                    { Id: '16', Name: '法规标准类别维护', ParentID: '01' },
                    { Id: '17', Name: '技术文档类别维护', ParentID: '01' },




                ];

                $scope.treeDataOra = [

                    { Id: '01', Name: '总部', ParentID: null },

                    { Id: '11', Name: '某某部门', ParentID: '01' },
                    { Id: '111', Name: '办公室一', ParentID: '11' },
                    { Id: '112', Name: '办公室二', ParentID: '11' },
                    { Id: '113', Name: '办公室三', ParentID: '11' },
                    { Id: '114', Name: '办公室四', ParentID: '11' },

                    { Id: '12', Name: '某某部门', ParentID: '01' },

                    { Id: '121', Name: '办公室一', ParentID: '12' },
                    { Id: '122', Name: '办公室二', ParentID: '12' },
                    { Id: '123', Name: '办公室三', ParentID: '12' },
                    { Id: '124', Name: '办公室四', ParentID: '12' },

                    { Id: '13', Name: '某某部门', ParentID: '01' },
                    { Id: '131', Name: '办公室一', ParentID: '13' },
                    { Id: '132', Name: '办公室二', ParentID: '13' },
                    { Id: '133', Name: '办公室三', ParentID: '13' },
                    { Id: '134', Name: '办公室四', ParentID: '13' }
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
                                CanDelete: params[i].iscandelete
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
                                CanDelete: params[i].iscandelete
                            }
                            $scope.treeDataTec.push(data);

                        }
                    })
                }
                $scope.initTec();

                $scope.sfsh = "是";

                $scope.pager.total = 10;
                $scope.clickTreeValue = "11";
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

                            if ($scope.clickTreeValue == '16') {
                                regulationService.DeleteLawstandardType(data, function (params) {
                                    if (params == 1) {
                                        toaster.pop({ type: 'success', body: '删除成功!' });
                                        $scope.initReg();
                                    } else {
                                        toaster.pop({ type: 'danger', body: '删除失败!' });
                                    }
                                })
                            } else {
                                technicalService.DeleteTechnicalType(data, function (params) {
                                    if (params == 1) {
                                        toaster.pop({ type: 'success', body: '删除成功!' });
                                        $scope.initTec();
                                    } else {
                                        toaster.pop({ type: 'danger', body: '删除失败!' });
                                    }
                                })
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

                                    if ($scope.clickTreeValue == '16') {
                                        regulationService.AddOrUpdateLawstandardType(data, function (params) {
                                            if (params == 1) {
                                                toaster.pop({ type: 'success', body: '编辑成功!' });
                                                $scope.initReg();
                                            } else {
                                                toaster.pop({ type: 'danger', body: '编辑失败!' });
                                            }
                                        })
                                    } else {
                                        technicalService.AddOrUpdateTechnicalType(data, function (params) {
                                            if (params == 1) {
                                                toaster.pop({ type: 'success', body: '编辑成功!' });
                                                $scope.initTec();
                                            } else {
                                                toaster.pop({ type: 'danger', body: '编辑失败!' });
                                            }
                                        })
                                    }

                                    break;
                                case 'down':



                                    var data = {
                                        id: '',
                                        typename: $scope.EditName,
                                        parentid: item.Id
                                    }

                                    if ($scope.clickTreeValue == '16') {
                                        regulationService.AddOrUpdateLawstandardType(data, function (params) {
                                            if (params == 1) {
                                                toaster.pop({ type: 'success', body: '新增下级成功!' });
                                                $scope.initReg();
                                            } else {
                                                toaster.pop({ type: 'danger', body: '新增下级失败!' });
                                            }
                                        })
                                    } else {
                                        technicalService.AddOrUpdateTechnicalType(data, function (params) {
                                            if (params == 1) {
                                                toaster.pop({ type: 'success', body: '新增下级成功!' });
                                                $scope.initTec();
                                            } else {
                                                toaster.pop({ type: 'danger', body: '新增下级失败!' });
                                            }
                                        })
                                    }

                                    break;
                                case 'equal':

                                    var data = {
                                        id: '',
                                        typename: $scope.EditName,
                                        parentid: item.ParentID
                                    }
                                    if ($scope.clickTreeValue == '16') {
                                        regulationService.AddOrUpdateLawstandardType(data, function (params) {
                                            if (params == 1) {
                                                toaster.pop({ type: 'success', body: '新增同级成功!' });
                                                $scope.initReg();
                                            } else {
                                                toaster.pop({ type: 'danger', body: '新增同级失败!' });
                                            }
                                        })
                                    } else {
                                        technicalService.AddOrUpdateTechnicalType(data, function (params) {
                                            if (params == 1) {
                                                toaster.pop({ type: 'success', body: '新增同级成功!' });
                                                $scope.initTec();
                                            } else {
                                                toaster.pop({ type: 'danger', body: '新增同级失败!' });
                                            }
                                        })
                                    }


                                    break;

                                default:
                                    break;
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