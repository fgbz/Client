define(['bootstrap/app', 'utils', 'services/technical-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('technicalDocuments-index-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'technical-service', 'ngDialog', '$stateParams', '$cookies', 'http-service', 'Upload',
        function ($rootScope, $scope, $state, toaster, $uibModal, technicalService, ngDialog, $stateParams, $cookies, http, Upload) {

            var postData = $stateParams.data;
            var user = sessionStorage.getItem('loginUser');

            if (user) {
                user = JSON.parse(user);

                //权限重置
                var check = utils.getListItem('技术文档查看', 'menuname', user.menus);
                var manage = utils.getListItem('技术文档管理', 'menuname', user.menus);

                $scope.isSup = utils.getListItem('超级管理员', 'menuname', user.menus);
                $scope.isTecMaintain = utils.getListItem('技术发布维护', 'menuname', user.menus);

                if (check) {
                    $scope.ischeckshow = true;
                    $scope.clickValue = 'check';
                    if (manage) {
                        $scope.ismanageshow = true;
                    }
                } else {
                    $scope.ismanageshow = true;
                    $scope.clickValue = 'add';
                }
            }

            var dics = JSON.parse(localStorage.getItem('DicItems'));

            $scope.PageSize = dics.PageSize;

            //变量
            var define_variable = function () {

                $scope.pager = {
                    size: 10,
                    current: 1
                }

                $scope.tableRow = {
                    selected: 0
                }

                $scope.pagerManage = {
                    size: 10,
                    current: 1
                }

                $scope.tableRowsearch = {
                    selected: 0
                }
                $scope.searchdata = {};
            };

            //加载
            var initialize = function () {


                $scope.isLoaded = true;

                if (postData) {
                    postData = JSON.parse(postData);

                    //保留查询条件
                    if (postData.selectData) {
                        $scope.searchdata = postData.selectData;
                    }
                }

                $scope.clickValue = postData && postData.clickValue ? postData.clickValue : $scope.clickValue;

                $scope.userList = user.userList;

                $scope.searchdata.selectInputUser = angular.copy(user.id);

                //右侧树
                technicalService.SelectTechnicalType(function (params) {
                    $scope.treeData = [];

                    for (var i = 0; i < params.length; i++) {
                        var data = {
                            Id: params[i].id,
                            Name: params[i].typename,
                            ParentID: params[i].parentid,
                            CanDelete: params[i].iscandelete
                        }
                        $scope.treeData.push(data);

                    }

                    if (postData && postData.treevalueid) {
                        $scope.clickTecValue = postData.treevalueid;
                    }
                })

            };

            //方法
            var define_function = function () {

                $scope.clickTable = function (params) {
                    $scope.tableRow.selected = params;
                    $scope.selectItem = $scope.itemManages[params];
                }

                $scope.clicksearchTable = function (params) {
                    $scope.tableRowsearch.selected = params;
                }

                $scope.clickTree = function (params) {
                    $scope.clickTecValue = params;
                }


                //新增
                $scope.Add = function () {
                    var sRouter = "main.technicalDocumentsAddOrEdit";

                    var itemDeal = {};
                    itemDeal.type = "add";
                    itemDeal.clickValue = $scope.clickValue;
                    itemDeal.selectData = $scope.searchdata;
                    itemDeal.treevalueid = $scope.clickTecValue;
                    var data = JSON.stringify(itemDeal);

                    $state.go(sRouter, { "data": data });
                }

                $scope.Edit = function () {

                    if (!$scope.selectItem) {
                        toaster.pop({ type: 'danger', body: '请选择编辑对象!' });
                        return;
                    }
                    var sRouter = "main.technicalDocumentsAddOrEdit";

                    var itemDeal = {};
                    itemDeal.type = "edit";
                    itemDeal.clickValue = $scope.clickValue;
                    itemDeal.selectData = $scope.searchdata;
                    itemDeal.treevalueid = $scope.clickTecValue;
                    itemDeal.item = { id: $scope.selectItem.id, approvestatus: $scope.selectItem.approvestatus };

                    var data = JSON.stringify(itemDeal);

                    $state.go(sRouter, { "data": data });
                }

                $scope.deleteLaw = function () {
                    if (!$scope.selectItem) {
                        toaster.pop({ type: 'danger', body: '请选择删除对象!' });
                        return;
                    }

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

                                technicalService.DeleteTechnicalById($scope.selectItem, function (res) {
                                    if (res == 200) {
                                        toaster.pop({ type: 'success', body: '删除成功!' });
                                        $scope.searchManage();
                                    } else {
                                        toaster.pop({ type: 'danger', body: '删除失败!' });
                                    }

                                })

                                $scope.closeThisDialog(); //关闭弹窗
                            };
                            $scope.cancel = function () {
                                $scope.closeThisDialog(); //关闭弹窗
                            }
                        }
                    });


                }

                //查看
                $scope.Check = function (item) {

                    var sRouter = "main.technicalDocumentsDetail";

                    var itemDeal = {};
                    itemDeal.type = "check";
                    itemDeal.clickValue = $scope.clickValue;
                    itemDeal.item = { id: item.id };
                    itemDeal.selectData = $scope.searchdata;
                    itemDeal.treevalueid = $scope.clickTecValue;
                    var data = JSON.stringify(itemDeal);

                    $state.go(sRouter, { "data": data });

                }

                //重置
                $scope.reset = function () {
                    $scope.searchdata.Number = "";
                    $scope.searchdata.Title = "";
                    $scope.searchdata.FiledTimeStart = "";
                    $scope.searchdata.FiledTimeEnd = "";
                    $scope.searchdata.KeyWordsSingle = "";

                }

                //点击树查询
                $scope.clicktree = function (item) {
                    $scope.clickTecValue = item;
                    $scope.searchinfo();
                }

                //查询
                $scope.searchinfo = function (isPaging) {

                    $scope.isLoaded = false;

                    //通过当前高度计算每页个数
                    var pagesize = parseInt((window.innerHeight - 500) / 40);

                    if (!isPaging) {
                        $scope.pager.current = 1;
                    }

                    $scope.pager.size = $scope.PageSize;

                    var options = {
                        pageNo: $scope.pager.current,
                        pageSize: $scope.pager.size,
                        conditions: []
                    };
                    if ($scope.searchdata.Number) {
                        options.conditions.push({ key: 'Number', value: $scope.searchdata.Number });
                    }
                    if ($scope.searchdata.Title) {
                        options.conditions.push({ key: 'Title', value: $scope.searchdata.Title });
                    }
                    if ($scope.searchdata.FiledTimeStart) {
                        options.conditions.push({ key: 'FiledTimeStart', value: $scope.searchdata.FiledTimeStart });
                    }
                    if ($scope.searchdata.FiledTimeEnd) {
                        options.conditions.push({ key: 'FiledTimeEnd', value: $scope.searchdata.FiledTimeEnd });
                    }
                    if ($scope.searchdata.KeyWordsSingle) {
                        options.conditions.push({ key: 'KeyWordsSingle', value: $scope.searchdata.KeyWordsSingle });
                    }
                    if ($scope.clickTecValue) {
                        options.conditions.push({ key: 'TreeValue', value: $scope.clickTecValue });
                    } else if (postData && postData.treevalueid) {
                        options.conditions.push({ key: 'TreeValue', value: postData.treevalueid });
                    }

                    options.conditions.push({ key: 'ApproveStatus', value: 2 });
                    $scope.tableRowsearch.selected = 0;
                    technicalService.getTechnicalList(options, function (response) {
                        $scope.isLoaded = true;
                        $scope.items = response.CurrentList;
                        $scope.pager.total = response.RecordCount;
                    })


                }

                $scope.searchinfo();

                $scope.searchManage = function (isPaging) {
                    $scope.isLoaded = false;

                    //通过当前高度计算每页个数
                    var pagesize = parseInt((window.innerHeight - 440) / 40);

                    if (!isPaging) {
                        $scope.pagerManage.current = 1;
                    }

                    $scope.pagerManage.size = $scope.PageSize;

                    var options = {
                        pageNo: $scope.pagerManage.current,
                        pageSize: $scope.pagerManage.size,
                        conditions: []
                    };

                    if ($scope.searchdata.KeyWords) {
                        options.conditions.push({ key: 'KeyWords', value: $scope.searchdata.KeyWords });
                    }
                    if ($scope.searchdata.ApproveStatus) {
                        options.conditions.push({ key: 'ApproveStatus', value: $scope.searchdata.ApproveStatus });
                    }
                    if ($scope.searchdata.IsBatch) {
                        options.conditions.push({ key: 'IsBatch', value: $scope.searchdata.IsBatch });
                    }
                    //有没有选择当前登录人
                    if ($scope.searchdata.selectInputUser == user.id || !$scope.searchdata.selectInputUser) {
                        options.conditions.push({ key: 'TecInputuserid', value: user.id })
                        var org = {
                            childsorg: user.orgList
                        }
                        options.conditions.push({ key: 'OrgList', value: JSON.stringify(org) });
                    } else {
                        options.conditions.push({ key: 'selectInputUser', value: $scope.searchdata.selectInputUser });
                    }

                    $scope.tableRow.selected = 0;
                    technicalService.getTechnicalList(options, function (response) {
                        $scope.isLoaded = true;
                        $scope.itemManages = response.CurrentList;
                        $scope.pagerManage.total = response.RecordCount;
                        if ($scope.itemManages.length > 0) {
                            $scope.selectItem = $scope.itemManages[0];
                        } else {
                            $scope.selectItem = "";
                        }

                    })

                }

                $scope.searchManage();


                //导出
                $scope.exporeTec = function () {

                    var data = {
                        Number: $scope.Number ? $scope.Number : null,
                        Title: $scope.Title ? $scope.Title : null,
                        FiledTimeStart: $scope.FiledTimeStart ? $scope.FiledTimeStart : null,
                        FiledTimeEnd: $scope.FiledTimeEnd ? $scope.FiledTimeEnd : null,
                        KeyWordsSingle: $scope.KeyWordsSingle ? $scope.KeyWordsSingle : null,
                        TreeValue: $scope.TreeValue ? $scope.TreeValue : null,
                    }
                    var url = baseUrl + "/Technical/ExportTec?Number=" + data.Number + "&Title=" + data.Title + "&FiledTimeStart=" + data.FiledTimeStart
                        + "&FiledTimeEnd=" + data.FiledTimeEnd + "&KeyWordsSingle=" + data.KeyWordsSingle + "&TreeValue=" + data.TreeValue + "&ApproveStatus=" + 2;

                    url = http.wrapUrl(url);
                    var exportWindow = window.open(url, "_blank");
                    exportWindow.document.title = "技术文档";
                }


                //批量导入
                $scope.defaultName = function (file) {
                    if (file == null)
                        return;

                    var url = baseUrl + '/Technical/ImportTec';

                    Upload.upload({
                        url: http.wrapUrl(url),
                        data: { file: file },
                        removeAfterUpload: true,
                    }).then(function (resp) {
                        if (resp.data.Result == 200) {
                            toaster.pop({ type: 'success', body: '导入成功!' });
                            $scope.searchManage();
                        } else if (resp.data.Result == 400) {
                            toaster.pop({ type: 'danger', body: resp.data.Msg, timeout: 0 });
                        } else {
                            toaster.pop({ type: 'danger', body: "时间格式有误", timeout: 0 });
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