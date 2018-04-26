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

                $scope.localLang = {
                    selectAll: "全选",
                    selectNone: "全不选",
                    reset: "清空",
                    search: "请输入条件筛选...",
                    nothingSelected: "全部"
                };
            };

            //加载
            var initialize = function () {


                $scope.isLoaded = true;

                if (postData) {
                    postData = JSON.parse(postData);

                    //保留查询条件
                    if (postData.selectData) {
                        $scope.searchdata = angular.copy(postData.selectData);
                        $scope.searchdata.TreeManageValue = "";
                    }
                }

                $scope.clickValue = postData && postData.clickValue ? postData.clickValue : $scope.clickValue;

                $scope.searchdata.Ordertype = postData && postData.selectData ? postData.selectData.Ordertype : '3';

                $scope.searchdata.SearchOrdertype = postData && postData.SearchOrdertype ? postData.selectData.SearchOrdertype : '3';

                $scope.userList = angular.copy(user.userList);

                $scope.searchdata.selectInputUser = postData && postData.selectData ? postData.selectData.selectInputUser : [{ id: "" }];

                for (var i = 0; i < $scope.userList.length; i++) {
                    if ($scope.searchdata.selectInputUser.length > 0 && $scope.userList[i].id == $scope.searchdata.selectInputUser[0].id) {
                        $scope.userList[i].Selected = true;
                    } else {
                        $scope.userList[i].Selected = false;
                    }
                }

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

                    if (postData && postData.selectData) {
                        $scope.searchdata.TreeManageValue = postData.selectData.TreeManageValue;
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

                    // $state.go(sRouter, { "data": data });
                    var url = $state.href(sRouter, { "data": data });
                    window.open(url, '_blank');

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
                    if ($scope.searchdata.SearchOrdertype) {
                        options.conditions.push({ key: 'SearchOrdertype', value: $scope.searchdata.SearchOrdertype });
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
                    if (!$scope.searchdata.selectInputUser || $scope.searchdata.selectInputUser.length == 0 || $scope.searchdata.selectInputUser[0].id == "") {
                        options.conditions.push({ key: 'TecInputuserid', value: user.id })
                        var org = {
                            childsorg: user.orgList
                        }
                        options.conditions.push({ key: 'OrgList', value: JSON.stringify(org) });
                    } else if ($scope.searchdata.selectInputUser[0].id == user.id) {
                        options.conditions.push({ key: 'InputUserMySelf', value: user.id });
                    } else {
                        options.conditions.push({ key: 'selectInputUser', value: $scope.searchdata.selectInputUser[0].id });
                    }

                    //类别
                    if ($scope.searchdata.TreeManageValue) {
                        options.conditions.push({ key: 'TreeValue', value: $scope.searchdata.TreeManageValue });
                    } else if (postData && postData.selectData && postData.selectData.TreeManageValue) {
                        options.conditions.push({ key: 'TreeValue', value: postData.selectData.TreeManageValue });
                    }
                    //排序
                    if ($scope.searchdata.Ordertype) {
                        options.conditions.push({ key: 'Ordertype', value: $scope.searchdata.Ordertype });
                    }

                    if (user.duty == 0) {
                        options.conditions.push({ key: 'Duty', value: user.id });
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

                //排序变化
                $scope.orderTypeChange = function () {
                    $scope.searchManage();
                }

                //查询排序变化
                $scope.SearchorderTypeChange = function () {
                    $scope.searchinfo();
                }

                //导出
                $scope.exporeTec = function () {

                    var data = {
                        Number: $scope.searchdata.Number ? $scope.searchdata.Number : null,
                        Title: $scope.searchdata.Title ? $scope.searchdata.Title : null,
                        FiledTimeStart: $scope.searchdata.FiledTimeStart ? $scope.searchdata.FiledTimeStart : null,
                        FiledTimeEnd: $scope.searchdata.FiledTimeEnd ? $scope.searchdata.FiledTimeEnd : null,
                        KeyWordsSingle: $scope.searchdata.KeyWordsSingle ? $scope.searchdata.KeyWordsSingle : null,
                        TreeValue: $scope.clickTecValue ? $scope.clickTecValue : null,
                        SearchOrdertype: $scope.searchdata.SearchOrdertype
                    }
                    var url = baseUrl + "/Technical/ExportTec?Number=" + data.Number + "&Title=" + data.Title + "&FiledTimeStart=" + data.FiledTimeStart
                        + "&FiledTimeEnd=" + data.FiledTimeEnd + "&KeyWordsSingle=" + data.KeyWordsSingle + "&TreeValue=" + data.TreeValue + "&ApproveStatus=" + 2 + "&SearchOrdertype=" + data.SearchOrdertype;

                    url = http.wrapUrl(url);
                    var exportWindow = window.open(url, "_blank");
                    exportWindow.document.title = "技术文档";
                }


                //导出技术文档管理
                $scope.ExportManager = function () {

                    var data = {
                        KeyWords: $scope.searchdata.KeyWords ? $scope.searchdata.KeyWords : null,
                        ApproveStatus: $scope.searchdata.ApproveStatus ? $scope.searchdata.ApproveStatus : null,
                        IsBatch: $scope.searchdata.IsBatch ? $scope.searchdata.IsBatch : null,
                        TreeValue: $scope.searchdata.TreeManageValue ? $scope.searchdata.TreeManageValue : null,
                        Ordertype: $scope.searchdata.Ordertype ? $scope.searchdata.Ordertype : null,
                        Duty: user.duty == 0 ? user.id : null,
                        TecInputuserid: null,
                        OrgList: null,
                        InputUserMySelf: null,
                        selectInputUser: null
                    }

                    //有没有选择当前登录人
                    if (!$scope.searchdata.selectInputUser || $scope.searchdata.selectInputUser.length == 0 || $scope.searchdata.selectInputUser[0].id == "") {
                        data.TecInputuserid = user.id;
                        data.OrgList = user.orgid;
                    } else if ($scope.searchdata.selectInputUser[0].id == user.id) {
                        data.InputUserMySelf = user.id;
                    } else {
                        data.selectInputUser = $scope.searchdata.selectInputUser[0].id
                    }

                    var url = baseUrl + "/Technical/ExportManager?KeyWords=" + data.KeyWords + "&ApproveStatus=" + data.ApproveStatus + "&IsBatch=" + data.IsBatch
                        + "&TreeValue=" + data.TreeValue + "&Ordertype=" + data.Ordertype + "&Duty=" + data.Duty + "&TecInputuserid=" + data.TecInputuserid + "&OrgList=" + data.OrgList + "&InputUserMySelf=" + data.InputUserMySelf + "&selectInputUser=" + data.selectInputUser;

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
                            toaster.pop({ type: 'danger', body: resp.data.Msg });
                        } else {
                            toaster.pop({ type: 'danger', body: "时间格式有误" });
                        }

                    });

                };

                //时间监听
                $scope.$watch('searchdata.FiledTimeStart', function (newValue, oldValue) {
                    if (newValue) {
                        if ($scope.searchdata.FiledTimeStart > $scope.searchdata.FiledTimeEnd && $scope.searchdata.FiledTimeEnd) {
                            toaster.pop({ type: 'danger', body: '结束时间不能早于开始时间！' });
                            $scope.searchdata.FiledTimeStart = oldValue;
                        }
                    }
                });
                $scope.$watch('searchdata.FiledTimeEnd', function (newValue, oldValue) {
                    if (newValue) {
                        if ($scope.searchdata.FiledTimeStart > $scope.searchdata.FiledTimeEnd) {
                            toaster.pop({ type: 'danger', body: '结束时间不能早于开始时间！' });
                            $scope.searchdata.FiledTimeEnd = oldValue;
                        }
                    }
                });

            };

            // 实际运行……
            define_variable();

            initialize();

            define_function();


        }]);
});