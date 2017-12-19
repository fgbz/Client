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

                //初始化收藏夹
                $scope.initFavor = function () {
                    usercenterService.getFavoriteList(user.favoriteid, function (params) {

                        $scope.treeFavoriteData = [];

                        for (var i = 0; i < params.length; i++) {
                            var data = {
                                Id: params[i].id,
                                Name: params[i].name,
                                ParentID: params[i].parentid,
                                CanDelete: true
                            }
                            $scope.treeFavoriteData.push(data);

                        }
                        if (params != null && params.length > 0) {
                            $scope.clickFavValue = params[0].id;
                            $scope.getLawsByLinkID();
                        }
                    })
                }


                //获取收藏夹对应法规列表
                $scope.getLawsByLinkID = function (isPaging) {
                    $scope.isLoaded = false;

                    //通过当前高度计算每页个数
                    var pagesize = parseInt((window.innerHeight - 240) / 40);

                    if (!isPaging) {
                        $scope.pagerDeal.current = 1;
                    }

                    $scope.pagerDeal.size = pagesize;

                    var options = {
                        pageNo: $scope.pagerDeal.current,
                        pageSize: $scope.pagerDeal.size,
                        conditions: []
                    };
                    if ($scope.clickFavValue) {
                        options.conditions.push({ key: 'TreeValue', value: $scope.clickFavValue });
                    }

                    usercenterService.getLawsByLinkID(options, function (response) {
                        $scope.isLoaded = true;
                        $scope.CollectItems = response.CurrentList;
                        $scope.pagerDeal.total = response.RecordCount;
                    })
                }

                //点击树查询
                $scope.clicktree = function (item) {
                    $scope.clickFavValue = item;
                    $scope.getLawsByLinkID();
                }

                $scope.clickMenu = function (params) {
                    $scope.clickMenuValue = params.Name;
                    switch (params.Name) {

                        case '收藏夹':
                            if ($scope.treeFavoriteData) {
                                $scope.getLawsByLinkID
                            } else {
                                $scope.initFavor();
                            }
                            break;
                        case '收藏夹管理':
                            $scope.initFavor();
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

                $scope.clickTreeBtn = function (item, type) {

                    switch (type) {
                        case 'delete':

                            var data = {
                                id: item.Id,
                                name: item.Name,
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

                                        usercenterService.DeleteFavoriteByID(data.id, function (params) {
                                            if (params == 200) {
                                                toaster.pop({ type: 'success', body: '删除成功!' });
                                                $scope.initFavor()
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
                                        name: $scope.EditName,
                                        parentid: item.ParentID,
                                        inputuserid: user.id,
                                        modifyuserid: user.id
                                    }
                                    var tet = "新增";

                                    addFav(data, tet)
                                    break;
                                case 'down':
                                    var data = {
                                        id: '',
                                        name: $scope.EditName,
                                        parentid: item.Id,
                                        inputuserid: user.id,
                                        modifyuserid: user.id
                                    }

                                    var tet = '新增下级';
                                    addFav(data, tet)
                                    break;
                                case 'equal':

                                    var data = {
                                        id: '',
                                        name: $scope.EditName,
                                        parentid: item.ParentID,
                                        inputuserid: user.id,
                                        modifyuserid: user.id
                                    }

                                    var tet = '新增同级';
                                    addFav(data, tet)
                                    break;

                                default:
                                    break;
                            }
                        }
                    });
                }

                //新增或编辑收藏夹
                function addFav(data, txt) {
                    usercenterService.SaveOrUpdateFavorite(data, function (params) {
                        if (params == 200) {
                            toaster.pop({ type: 'success', body: txt + '成功!' });
                            $scope.initFavor();
                        } else {
                            toaster.pop({ type: 'danger', body: txt + '失败!' });
                        }
                    })
                }

                //初始化tab页
                if (postData) {
                    postData = JSON.parse(postData);
                    var data = { Name: '待办箱' };
                    $scope.clickMenu(data);
                }

                //取消收藏
                $scope.dismissFav = function (item) {

                    $scope.text = "确定取消收藏吗？";
                    var modalInstance = ngDialog.openConfirm({
                        templateUrl: 'partials/_confirmModal.html',
                        appendTo: 'body',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope,
                        size: 400,
                        controller: function ($scope) {
                            $scope.ok = function () {

                                usercenterService.DismissFavorite($scope.clickFavValue, item.id, function (params) {
                                    if (params == 200) {
                                        toaster.pop({ type: 'success', body: '取消收藏成功!' });
                                        $scope.initFavor();
                                    } else {
                                        toaster.pop({ type: 'success', body: '取消收藏失败!' });
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