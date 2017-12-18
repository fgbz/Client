define(['bootstrap/app', 'utils', 'services/enum-service', 'services/usercenter-service', 'services/regulation-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('userCenter-index-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'usercenter-service', 'ngDialog', 'regulation-service', '$stateParams',
        function ($rootScope, $scope, $state, toaster, $uibModal, usercenterService, ngDialog, regulationService, $stateParams) {

            var user = localStorage.getItem("loginUser");

            if (user) {
                user = JSON.parse(user);
            }
            var postData = $stateParams.data;

            //变量
            var define_variable = function () {

                $scope.pager = {
                    size: 10,
                    current: 1
                }

                $scope.tableRow = {
                    selected: 0
                }

                $scope.pagerDeal = {
                    size: 10,
                    current: 1
                }

                $scope.pagerAdvice = {
                    size: 10,
                    current: 1
                }

                $scope.pagerLawstandard = {
                    size: 10,
                    current: 1
                }

                $scope.adviceData = {};
                $scope.approvedata = {};

            };

            //加载
            var initialize = function () {

                $scope.isLoaded = true;

                $scope.MenuItmes = [
                    { Name: "修改密码" }, { Name: "收藏夹" }, { Name: "收藏夹管理" },
                ]


                var user = localStorage.getItem("loginUser");

                if (user) {
                    user = JSON.parse(user);

                    //权限重置
                    var check = utils.getListItem('法规审核', 'menuname', user.menus);
                    var manage = utils.getListItem('通知管理', 'menuname', user.menus);

                    if (check) {
                        $scope.MenuItmes.push({ Name: "待办箱" });
                    }
                    if (manage) {
                        $scope.MenuItmes.push({ Name: "通知管理" });
                    }
                }

                $scope.clickMenuValue = "修改密码";

                //右侧树
                $scope.treeData = [

                    { Id: '01', Name: '法律标准', ParentID: null },

                    { Id: '11', Name: '国家行政文件', ParentID: '01' },
                    { Id: '111', Name: '国家法律', ParentID: '11' },
                    { Id: '112', Name: '国务院法律', ParentID: '11' },
                    { Id: '113', Name: 'HAF', ParentID: '11' },
                    { Id: '114', Name: 'HAD', ParentID: '11' },

                    { Id: '12', Name: '国家标准', ParentID: '01' },

                    { Id: '121', Name: '国家标准', ParentID: '12' },
                    { Id: '122', Name: '能源局标准', ParentID: '12' },
                    { Id: '123', Name: '核行业标准', ParentID: '12' },
                    { Id: '124', Name: '电力行业标准', ParentID: '12' },

                    { Id: '13', Name: '国际公约及标准', ParentID: '01' },
                    { Id: '131', Name: '国际公约', ParentID: '13' },
                    { Id: '132', Name: 'ASTM', ParentID: '13' },
                    { Id: '133', Name: 'ASTM', ParentID: '13' },
                    { Id: '134', Name: '国际标准', ParentID: '13' }

                ];

                $scope.CollectItems = [
                    { Title: "中华人民共和国劳动合同法", CollectionDate: "2014-12-09" },
                    { Title: "中华人民共和国特种设备安全法", CollectionDate: "2014-12-09" },
                    { Title: "中华人民共和国环境保护法", CollectionDate: "2016-08-21" },
                    { Title: "中华人民共和国安全生产法", CollectionDate: "2014-11-19" },
                    { Title: "中华人民共和国职业病防治法", CollectionDate: "2013-05-05" },
                    { Title: "中华人民共和国劳动法", CollectionDate: "2015-11-19" },
                    { Title: "中华人民共和国劳动合同法", CollectionDate: "2014-06-12" },
                    { Title: "中华人民共和国安全生产法", CollectionDate: "2014-06-12" },
                    { Title: "中华人民共和国预算法", CollectionDate: "2014-06-12" },
                    { Title: "中华人民共和国环境保护法", CollectionDate: "2014-06-12" }
                ]


                $scope.pager.total = 10;
                $scope.pagerDeal.total = 10;

                $scope.clickMenu = function (params) {
                    $scope.clickMenuValue = params.Name;
                    switch (params.Name) {
                        case '通知管理':
                            $scope.selectAdvice();
                            break;
                        case '待办箱':
                            $scope.searchLawstandards();
                            break;

                        default:
                            break;
                    }
                }


            };

            //方法
            var define_function = function () {

                //获取通知列表
                $scope.selectAdvice = function (isPaging) {
                    $scope.isLoaded = false;

                    //通过当前高度计算每页个数
                    var pagesize = parseInt((window.innerHeight - 200) / 40);

                    if (!isPaging) {
                        $scope.pagerAdvice.current = 1;
                    }

                    $scope.pagerAdvice.size = pagesize;

                    var options = {
                        pageNo: $scope.pagerAdvice.current,
                        pageSize: $scope.pagerAdvice.size,
                        conditions: []
                    };
                    if ($scope.adviceData.Title) {
                        options.conditions.push({ key: 'Title', value: $scope.adviceData.Title });
                    }

                    usercenterService.getAdviceList(options, function (response) {
                        $scope.isLoaded = true;
                        $scope.adviceItems = response.CurrentList;
                        $scope.pagerAdvice.total = response.RecordCount;
                    })
                }




                //待办箱审核列表
                $scope.searchLawstandards = function (isPaging) {
                    $scope.isLoaded = false;

                    //通过当前高度计算每页个数
                    var pagesize = parseInt((window.innerHeight - 240) / 40);

                    if (!isPaging) {
                        $scope.pagerLawstandard.current = 1;
                    }

                    $scope.pagerLawstandard.size = pagesize;

                    var options = {
                        pageNo: $scope.pagerLawstandard.current,
                        pageSize: $scope.pagerLawstandard.size,
                        conditions: []
                    };
                    if ($scope.approvedata.KeyWordLaw) {
                        options.conditions.push({ key: 'KeyWords', value: $scope.approvedata.KeyWordLaw });
                    }
                    options.conditions.push({ key: 'ApproveStatus', value: 2 });
                    regulationService.getLawstandardList(options, function (response) {
                        $scope.isLoaded = true;
                        $scope.LawstandardItems = response.CurrentList;
                        $scope.pagerLawstandard.total = response.RecordCount;

                    })

                }
                if (postData) {
                    postData = JSON.parse(postData);
                    var data = { Name: '待办箱' };
                    $scope.clickMenu(data);
                }

                $scope.Exam = function (item) {

                    var url = 'partials/system/modals/examCheck.html';
                    var modalInstance = $uibModal.open({

                        templateUrl: url,
                        controller: 'examCheck-controller',
                        size: 600,
                        resolve: {
                            values: function () {
                                var data = {
                                    item: item,
                                    isCheck: false
                                }
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (res) {

                        if (res) {
                            $scope.searchLawstandards();
                        }
                    }, function (reason) { }

                    );
                }


                //查看
                $scope.Check = function (item) {

                    regulationService.AddLawstandardCount(item, function () {
                        var sRouter = "main.regulationsStandardsDetail";

                        var itemDeal = {};
                        itemDeal.type = "check";
                        itemDeal.clickValue = 'approve';
                        itemDeal.item = item;

                        var data = JSON.stringify(itemDeal);

                        $state.go(sRouter, { "data": data });
                    })

                }



                $scope.clickTable = function (params) {
                    $scope.tableRow.selected = params;
                }

                $scope.clickTree = function (params) {
                    $scope.clickTreeValue = params;
                }


                //新增，查看通知
                $scope.ShowAdvice = function (item, flag, txt) {
                    var url = 'partials/system/modals/advice.html';
                    var modalInstance = $uibModal.open({

                        templateUrl: url,
                        controller: 'advice-controller',
                        size: 600,
                        resolve: {
                            values: function () {
                                var data = {
                                    id: '',
                                    Title: txt,
                                    isCheck: flag
                                }
                                if (item != null) {
                                    data.id = item.id;
                                }
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (res) {
                        if (res) {
                            if (item == null) {
                                $scope.selectAdvice();
                            }
                        }
                    });

                }
                //删除通知
                $scope.DeleteAdvice = function (item) {

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

                                usercenterService.DeleteAdviceByID(item.id, function (params) {
                                    if (params == 200) {
                                        toaster.pop({ type: 'success', body: '删除成功！' });
                                        $scope.selectAdvice();
                                    } else {
                                        toaster.pop({ type: 'danger', body: '删除失败！' });
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
            };

            // 实际运行……
            define_variable();

            initialize();

            define_function();


        }]);
});