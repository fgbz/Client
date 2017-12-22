define(['bootstrap/app', 'utils', 'app/config-manager', 'services/regulation-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('regulationsStandards-index-controller', ['$stateParams', '$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'regulation-service', 'ngDialog', '$cookies', 'http-service', 'Upload',
        function ($stateParams, $rootScope, $scope, $state, toaster, $uibModal, regulationService, ngDialog, $cookies, http, Upload) {

            var postData = $stateParams.data;

            var user = sessionStorage.getItem('loginUser');

            if (user) {
                user = JSON.parse(user);

                //权限重置
                var check = utils.getListItem('法规标准查看', 'menuname', user.menus);
                var manage = utils.getListItem('法规标准管理', 'menuname', user.menus);

                $scope.isSup = utils.getListItem('超级管理员', 'menuname', user.menus);

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

            //变量
            var define_variable = function () {

                $scope.pager = {
                    size: 10,
                    current: 1
                }

                $scope.pagerManage = {
                    size: 10,
                    current: 1
                }


                $scope.tableRow = {
                    selected: 0
                }

                $scope.tableRowsearch = {
                    selected: 0
                }
            };

            //加载
            var initialize = function () {

                if (postData) {
                    postData = JSON.parse(postData);

                    if (postData.treevalueid) {
                        $scope.clickTreeValue = postData.treevalueid;
                    }
                }



                $scope.clickValue = postData && postData.clickValue ? postData.clickValue : $scope.clickValue;

                $scope.isLoaded = true;

                var dics = JSON.parse(localStorage.getItem('DicItems'));

                $scope.PublishList = dics.Pub;
                $scope.StateList = dics.State;


                //右侧树
                regulationService.SelectLawstandardType(function (params) {
                    $scope.treeData = [];

                    for (var i = 0; i < params.length; i++) {
                        var data = {
                            Id: params[i].id,
                            Name: params[i].typename,
                            ParentID: params[i].parentid
                        }
                        $scope.treeData.push(data);

                    }
                }, function (er) {
                    var t = er;
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
                    $scope.clickTreeValue = params;
                }

                //新增
                $scope.Add = function () {
                    var sRouter = "main.regulationsStandardsAddOrEdit";

                    var itemDeal = {};
                    itemDeal.type = "add";
                    itemDeal.clickValue = $scope.clickValue;

                    var data = JSON.stringify(itemDeal);

                    $state.go(sRouter, { "data": data });
                }

                $scope.Edit = function () {

                    if (!$scope.selectItem) {
                        toaster.pop({ type: 'danger', body: '请选择编辑对象!' });
                        return;
                    }
                    var sRouter = "main.regulationsStandardsAddOrEdit";

                    var itemDeal = {};
                    itemDeal.type = "edit";
                    itemDeal.clickValue = $scope.clickValue;
                    itemDeal.item = $scope.selectItem;

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

                                regulationService.DeleteLawstandardById($scope.selectItem, function (res) {
                                    if (res == 200) {
                                        toaster.pop({ type: 'succcess', body: '删除成功!' });
                                        $scope.searchManage();
                                    } else {
                                        toaster.pop({ type: 'succcess', body: '删除失败!' });
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

                    regulationService.AddLawstandardCount(item, function () {
                        var sRouter = "main.regulationsStandardsDetail";

                        var itemDeal = {};
                        itemDeal.type = "check";
                        itemDeal.clickValue = $scope.clickValue;
                        itemDeal.item = item;

                        var data = JSON.stringify(itemDeal);

                        $state.go(sRouter, { "data": data });
                    })

                }

                //重置
                $scope.reset = function () {
                    $scope.Number = "";
                    $scope.Title = "";
                    $scope.FiledTimeStart = "";
                    $scope.FiledTimeEnd = "";
                    $scope.State = "";
                    $scope.organization = "";
                    $scope.MaterialTmeStart = "";
                    $scope.MaterialTmeEnd = "";
                }

                //点击树查询
                $scope.clicktree = function (item) {
                    $scope.clickTreeValue = item;
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

                    $scope.pager.size = pagesize;

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
                    if ($scope.FiledTimeStart) {
                        options.conditions.push({ key: 'FiledTimeStart', value: $scope.FiledTimeStart });
                    }
                    if ($scope.FiledTimeEnd) {
                        options.conditions.push({ key: 'FiledTimeEnd', value: $scope.FiledTimeEnd });
                    }
                    if ($scope.State) {
                        options.conditions.push({ key: 'State', value: $scope.State });
                    }
                    if ($scope.organization) {
                        options.conditions.push({ key: 'organization', value: $scope.organization });
                    }
                    if ($scope.MaterialTmeStart) {
                        options.conditions.push({ key: 'MaterialTmeStart', value: $scope.MaterialTmeStart });
                    }
                    if ($scope.MaterialTmeEnd) {
                        options.conditions.push({ key: 'MaterialTmeEnd', value: $scope.MaterialTmeEnd });
                    }
                    if ($scope.clickTreeValue) {
                        options.conditions.push({ key: 'TreeValue', value: $scope.clickTreeValue });
                    }

                    options.conditions.push({ key: 'ApproveStatus', value: 3 });

                    $scope.tableRowsearch.selected = 0;

                    regulationService.getLawstandardList(options, function (response) {
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

                    $scope.pagerManage.size = pagesize;

                    var options = {
                        pageNo: $scope.pagerManage.current,
                        pageSize: $scope.pagerManage.size,
                        conditions: []
                    };
                    if ($scope.KeyWords) {
                        options.conditions.push({ key: 'KeyWords', value: $scope.KeyWords });
                    }
                    if ($scope.ApproveStatus) {
                        options.conditions.push({ key: 'ApproveStatus', value: $scope.ApproveStatus });
                    }
                    if ($scope.IsBatch) {
                        options.conditions.push({ key: 'IsBatch', value: $scope.IsBatch });
                    }
                    options.conditions.push({ key: 'LawInputuserid', value:user.id });
                    
                    $scope.tableRow.selected = 0;



                    regulationService.getLawstandardList(options, function (response) {
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


                $scope.Exam = function () {

                    if (!$scope.selectItem) {
                        toaster.pop({ type: 'danger', body: '请选择查看对象!' });
                        return;
                    }


                    var url = 'partials/system/modals/examCheck.html';
                    var modalInstance = $uibModal.open({

                        templateUrl: url,
                        controller: 'examCheck-controller',
                        size: 600,
                        resolve: {
                            values: function () {
                                var data = {
                                    item: $scope.selectItem,
                                    isCheck: true
                                }
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (res) {

                    }, function (reason) { }

                    );
                }

                //导出
                $scope.exporeLaw = function () {

                    var data = {
                        Number: $scope.Number ? $scope.Number : null,
                        Title: $scope.Title ? $scope.Title : null,
                        FiledTimeStart: $scope.FiledTimeStart ? $scope.FiledTimeStart : null,
                        FiledTimeEnd: $scope.FiledTimeEnd ? $scope.FiledTimeEnd : null,
                        State: $scope.State ? $scope.State : null,
                        organization: $scope.organization ? $scope.organization : null,
                        MaterialTmeStart: $scope.MaterialTmeStart ? $scope.MaterialTmeStart : null,
                        MaterialTmeEnd: $scope.MaterialTmeEnd ? $scope.MaterialTmeEnd : null,
                        TreeValue: $scope.TreeValue ? $scope.TreeValue : null,
                    }
                    var url = baseUrl + "/Lawstandard/ExportLaw?Number=" + data.Number + "&Title=" + data.Title + "&FiledTimeStart=" + data.FiledTimeStart
                        + "&FiledTimeEnd=" + data.FiledTimeEnd + "&State=" + data.State + "&organization=" + data.organization + "&MaterialTmeStart=" + data.MaterialTmeStart
                        + "&MaterialTmeEnd=" + data.MaterialTmeEnd + "&TreeValue=" + data.TreeValue + "&ApproveStatus=" + 3;

                    url = http.wrapUrl(url);
                    var exportWindow = window.open(url, "_blank");
                    exportWindow.document.title = "法规标准";
                }

                //批量导入
                $scope.defaultName = function (file) {
                    if (file == null)
                        return;

                    var url = baseUrl + '/Lawstandard/ImportLaw';

                    Upload.upload({
                        url: http.wrapUrl(url),
                        data: { file: file },
                        removeAfterUpload: true,
                    }).then(function (resp) {
                        switch (resp.data) {
                            case 200:
                                toaster.pop({ type: 'success', body: '导入成功!' });
                                $scope.searchManage();
                                break;
                            case 404:
                                toaster.pop({ type: 'danger', body: '内容为空!', timeout: 0 });
                                break;
                            case 1:
                                toaster.pop({ type: 'danger', body: '中文标题不能为空!', timeout: 0 });
                                break;
                            case 2:
                                toaster.pop({ type: 'danger', body: '编号不能为空!', timeout: 0 });
                                break;

                            default:
                                toaster.pop({ type: 'error', body: '导入失败!', timeout: 0 });
                                break;
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