define(['bootstrap/app', 'services/organization-manager-service', 'services/region-service', 'utilities/cryto'], function (app) {
    'use strict';

    app.controller('organization-controller', ['$rootScope', '$scope', '$state', 'organization-manager-service', '$uibModal', 'region-service', 'toaster', 'ngDialog', function ($rootScope, $scope, $state, organizationService, $modal, regionService, toaster, ngDialog) {
        var treeDate;
        // 代码组织规则：
        // 1、所有在 View 中绑定用到的变量，都在最开始设置初始值。以便于了解有哪些绑定的变量，同时避免没有设置初始值可能引起的问题。

        // 变量的定义。
        var define_variable = function () {

        };

        // 初始化方法。
        var initialize = function () {
            var treeNodes = JSON.parse(localStorage.getItem('treeParent'));
            treeDate = treeNodes;
            // alert(JSON.stringify(treeNodes,0,1))
            $scope.data = treeNodes;
            //edit rootnode
            $scope.editNode = $scope.editNode ? $scope.editNode : angular.copy($scope.data[0]);
            $scope.operateName = '编辑';
            $scope.inEditor($scope.editNode);
        };

        //方法的定义
        var define_function = function () {
            $scope.removeItem = function (scope) {
                // var modal = utils.confirm({ msg: '确定删除组织吗？', ok: '确定', cancel: '取消' },'sm');
                // modal.result.then(function () {
                $scope.initNode = scope.$modelValue;
                //alert(JSON.stringify(scope.$modelValue,0,1))

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
                            organizationService.deleteTreeNode(scope.$modelValue).success(function (res) {
                                if (res.Code == 1) {
                                    scope.remove();
                                    var partentScope = scope.$parentNodeScope;
                                    partentScope.$modelValue.sub_node_count = partentScope.$modelValue.nodes.length;
                                    $scope.inEditor(partentScope.$modelValue);
                                    toaster.pop({ type: 'success', body: '删除成功!' });
                                    $scope.closeThisDialog(); //关闭弹窗
                                } else {
                                    $scope.closeThisDialog(); //关闭弹窗
                                    if (res.Message != "") {
                                        toaster.pop({ type: 'warning', body: res.Message + '!' });
                                    } else {
                                        toaster.pop({ type: 'error', body: '删除失败!' });
                                    }

                                }
                            })
                        };
                        $scope.cancel = function () {
                            $scope.closeThisDialog(); //关闭弹窗
                        }
                    }
                })
            };

            $scope.newSubItem = function (node, type, event) {
                $scope.initNode = node;
                $scope.isShowRegion = false;
                //alert(JSON.stringify(node,0,1))
                //$scope.orgLevel = node.type;
                $scope.operateName = '添加';
                if (type == 1) {
                    //add oraganzation
                    $scope.editNode = {
                        'id': '',
                        'title': '',
                        'description': '',
                        'region_code': node.region_code,
                        'regionCodeName': node.region_code,
                        'type': 1,
                        'orgLevel': 0,
                        'parentId': node.id,
                        'nodes': []

                    };
                    if (node.type == 99) {
                        $scope.isShowCompanyLevel = true;
                        //$scope.editNode.orgLevel=99;
                    }
                    else {
                        $scope.isShowCompanyLevel = false;
                    }
                    //初始化行政区划
                    $scope.province = '';
                    $scope.city = '';
                    $scope.district = '';
                } else {
                    //getParentOrganzationId
                    var organizationId = organizationService.getParentOrganizationId(angular.element(event.target).scope().$nodeScope);
                    //add department
                    $scope.editNode = {
                        'id': '',
                        'title': '',
                        'description': '',
                        'region_code': node.region_code,
                        'regionCodeName': node.region_code,
                        'type': 2,
                        'orgLevel': 0,
                        'parentId': node.type == 1 ? '00000000-0000-0000-0000-000000000000' : node.id,
                        'organizationId': organizationId,//node.type == 1 ? node.id : '00000000-0000-0000-0000-000000000000',
                        'nodes': []

                    };
                }
                $scope.nodeData = node;
            };

            //init edit form
            $scope.inEditor = function (node) {
                // alert(JSON.stringify(node,0,1))
                $scope.isShowRegion = false;
                $scope.isShowRegionCity = false;
                $scope.isShowRegionDistrict = false;
                $scope.orgLevel = node.type;
                $scope.operateName = '编辑';
                $scope.initNode = node;
                var editNode = angular.copy(node);
                $scope.province = '';
                $scope.city = '';
                // $scope.editNode.regionCode='';
                $scope.province = '';
                $scope.city = '';
                $scope.district = '';
                $scope.editNode = editNode;
                $scope.editNode.regionCodeName = editNode.region_code;
                $scope.nodeData = node;
                //alert(JSON.stringify($scope.editNode,0,1))
            }

            $scope.Submit = function (editOrinsert) {
                //处理行政区号
                // if ($scope.editNode.orgLevel == 0) {
                //   if ($scope.editNode.type == '1') {
                //     //$scope.editNode.orgLevel=99;
                //     $scope.$parent.alertMessage('warning', '级别不能为空');
                //     return
                //   }
                // }
                $scope.editNode.region_code = $scope.editNode.regionCodeName;
                if ($scope.editNode.title.length != 0) {
                    if (editOrinsert == 1) {
                        //   alert(JSON.stringify($scope.editNode,0,1))
                        //updateTreeNode
                        //调用名称的验证
                        //   organizationService.isNameExist($scope.editNode.type, $scope.editNode.title, $scope.editNode.id).success(function (res) {
                        //       if (res.Code == 0) {
                        organizationService.updateTreeNode($scope.editNode, treeDate).success(function (res) {
                            if (res.Code == 1) {
                                angular.extend($scope.nodeData, $scope.editNode);
                                toaster.pop({ type: 'success', body: '修改成功!' });
                                $scope.isShowRegion = false;
                                $scope.isShowRegionCity = false;
                                $scope.isShowRegionDistrict = false;
                            }
                            else {
                                toaster.pop({ type: 'error', body: '修改失败,请重新输入!' });
                            }
                        });
                        //     } else {
                        //         toaster.pop({type: 'warning', body: '该名称已存在!'});
                        //     }
                        // });
                    }
                    else {
                        //insertTreeNode
                        //名称验证，是否重复 因为是新增，所以传递空的id过去
                        //organizationService.isNameExist($scope.editNode.type, $scope.editNode.title, '00000000-0000-0000-0000-000000000000').success(function (res) {
                        // if (res.Code == 0) {
                        organizationService.insertTreeNode($scope.editNode).success(function (res) {
                            if (res.Code == 1) {
                                $scope.editNode.id = res.Message;
                                toaster.pop({ type: 'success', body: '添加成功!' });

                                $scope.isShowRegion = false;
                                $scope.isShowRegionCity = false;
                                $scope.isShowRegionDistrict = false;
                                //refresh Tree
                                //  construct();
                                updateTreeNode();
                            }
                            else {
                                toaster.pop({ type: 'error', body: '添加失败,请重新输入!' });
                            }
                        });
                        //} else {
                        //   toaster.pop({type: 'warning', body: '该名称已存在!'});
                        //}
                        //});
                    }
                }
                else {
                    document.getElementById("organName").focus();
                    toaster.pop({ type: 'warning', body: '名称不能为空!' });
                }
            };

            $scope.toggles = function (scope) {
                //alert(JSON.stringify(scope.$nodeScope.$modelValue,0,1));
                //angular.extend($scope.nodeData, $scope.editNode);
                var nodePair = scope.$nodeScope.$modelValue;
                if (nodePair.nodes.length == 0) {
                    if (nodePair.type == 1) {
                        organizationService.getTreeChild(nodePair.id).success(function (res) {
                            //angular.extend(res.Data, $scope.data[0]);

                            getSelectNode($scope.data, nodePair, res.Data);

                            treeDate = $scope.data;

                        })
                    }
                    else {
                        organizationService.getTreeChildDep(nodePair.id).success(function (res) {
                            //angular.extend(res.Data, $scope.data[0]);

                            getSelectNode($scope.data, nodePair, res.Data);

                            treeDate = $scope.data;

                        })
                    }
                }

                scope.toggle();
            };

            $scope.collapseAll = function () {
                $scope.$broadcast('collapseAll');
            };

            $scope.expandAll = function () {
                $scope.$broadcast('expandAll');
            };

            // $scope.title='';
            $scope.mouseover = function (scope, name) {
                scope.SelectShow = true;
            }

            //取消
            $scope.Cancel = function () {
                // alert(JSON.stringify($scope.nodeData,0,4))
                $scope.inEditor($scope.nodeData)
            }

            $scope.mouseout = function (scope) {
                scope.SelectShow = false;
                // this.$modelValue.title=$scope.title;
            }

            $scope.blur = function () {
                if ($scope.editNode.title.length == 0) {
                    document.getElementById("organName").focus();
                    //alertMessage('warning', "名称不能为空")
                }

            }

            /* 选择行政区划 start */
            $scope.showRegion = function () {
                $scope.showTab = 1;
                $scope.isShowRegion = true;
                // $scope.isShowSubmit=false;
                regionService.GetRoot($scope.editNode.regionCodeName).success(function (res) {
                    $scope.AllProvince = res;//res.Data;
                    $scope.showRegionCity($scope.AllProvince[0]);
                    angular.forEach($scope.RegionCity, function (v, k) {
                        if (v.Code == $scope.initNode.region_code) {
                            $scope.editNode.regionCodeName = $scope.AllProvince[0].Code;
                            $scope.showTab = 1;
                        }
                    });
                });
            }

            $scope.showRegionCity = function (region) {
                //$scope.editNode.regionId = region.Id;
                $scope.isShowRegionCity = true;
                $scope.isShowRegionDistrict = false;
                regionService.GetSub(region.Code,2).success(function (res) {
                    $scope.RegionCity = res;//res.Data;
                    angular.forEach($scope.RegionCity, function (v, k) {
                        if (v.Code == $scope.initNode.region_code) {
                            $scope.editNode.regionCodeName = v.Code;//v.Name + '-' + v.Code;
                            $scope.showTab = 2;
                        }
                    });
                $scope.showRegionDistrict($scope.initNode.region_code);
                });
            }

            $scope.showRegionDistrict = function (region) {
                //$scope.editNode.regionId = region.Id;
                $scope.isShowRegionDistrict = true;
                regionService.GetSub(region,3).success(function (res) {
                    $scope.RegionDistrict = res;
                    if (v.Code == $scope.initNode.region_code) {
                            $scope.editNode.regionCodeName = v.Code;//v.Name + '-' + v.Code;
                            $scope.showTab = 3;
                        }
                });
            }

            $scope.getRegion = function (Id) {
                $scope.editNode.region_code = Id;
            }

            $scope.regionSubmit = function () {
                $scope.isShowRegion = false;
                $scope.isShowRegionCity = false;
                $scope.isShowRegionDistrict = false;
                $scope.RegionCity = {};
                $scope.RegionDistrict = {};
                // $scope.isShowSubmit=true;
            }

            $scope.regionCancel = function () {
                $scope.isShowRegion = false;
                $scope.isShowRegionCity = false;
                $scope.isShowRegionDistrict = false;
                $scope.RegionCity = {};
                $scope.RegionDistrict = {};
                $scope.editNode.regionId = $scope.nodeData.regionId;
                $scope.editNode.regionCodeName = $scope.nodeData.regionCodeName;
                // $scope.isShowSubmit=true;
            }

            /* 选择行政区划  end */
        }

        var updateNode = function (treeNode, node, childNode) {
            //alert()
            angular.forEach(treeNode, function (value, key) {
                //alert(key);
                //alert(JSON.stringify(value,0,1))
                if (node.id == value.id) {
                    value.nodes = childNode;
                    value.sub_node_count = childNode.length;
                    $scope.initNode = angular.copy($scope.editNode);
                }
                else {
                    updateNode(value.nodes, node, childNode);
                }
            });
        }

        //添加和删除组织部门 时 获取修改的部分
        var updateTreeNode = function () {
            if ($scope.initNode.type == 1) {
                organizationService.getTreeChild($scope.initNode.id).success(function (res) {
                    //angular.extend(res.Data, $scope.data[0]);

                    updateNode($scope.data, $scope.initNode, res.Data);

                    treeDate = $scope.data;

                })
            }
            else {
                organizationService.getTreeChild($scope.initNode.id).success(function (res) {
                    //angular.extend(res.Data, $scope.data[0]);

                    updateNode($scope.data, $scope.initNode, res.Data);

                    treeDate = $scope.data;

                })
            }
        };


        var getSelectNode = function (treeNode, node, childNode) {
            angular.forEach(treeNode, function (value, key) {
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