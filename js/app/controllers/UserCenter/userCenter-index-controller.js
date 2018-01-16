define(['bootstrap/app', 'utils', 'services/enum-service', 'services/usercenter-service', 'services/regulation-service', 'services/md5-service', 'services/system-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('userCenter-index-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'usercenter-service', 'ngDialog', 'regulation-service', '$stateParams', 'md5-service', '$cookies', 'system-service',
        function ($rootScope, $scope, $state, toaster, $uibModal, usercenterService, ngDialog, regulationService, $stateParams, md5Service, $cookies, systemService) {

            var postData = $stateParams.data;
            var user = sessionStorage.getItem('loginUser');

            var dics = JSON.parse(localStorage.getItem('DicItems'));

            $scope.PageSize = dics.PageSize;

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
                $scope.passworddata = {};

            };

            //加载
            var initialize = function () {

                //初始化组织机构
                $scope.initOrg = function () {
                    systemService.getOrganizationList(function (params) {
                        $scope.treeDataOrg = [];

                        for (var i = 0; i < params.length; i++) {
                            var data = {
                                Id: params[i].id,
                                Name: params[i].orgname,
                                ParentID: params[i].parentid,
                                CanDelete: params[i].candelete,
                                itemlevel: params[i].itemlevel,
                                itemlevelcode: params[i].itemlevelcode,
                            }
                            $scope.treeDataOrg.push(data);

                        }
                    })
                };
                $scope.initOrg();

                $scope.isLoaded = true;

                $scope.MenuItmes = [
                    { Name: "修改密码" }, { Name: "收藏夹" }, { Name: "收藏夹管理" },
                ]




                if (user) {
                    user = JSON.parse(user);

                    //权限重置
                    var check = utils.getListItem('待办箱', 'menuname', user.menus);
                    var manage = utils.getListItem('通知管理', 'menuname', user.menus);
                    $scope.isSup = utils.getListItem('超级管理员', 'menuname', user.menus);
                    $scope.user = user;
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
                                CanDelete: true,
                                itemlevel: params[i].itemlevel,
                                itemlevelcode: params[i].itemlevelcode,
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

                    $scope.pagerDeal.size = $scope.PageSize;

                    var options = {
                        pageNo: $scope.pagerDeal.current,
                        pageSize: $scope.pagerDeal.size,
                        conditions: []
                    };
                    if ($scope.clickFavValue) {
                        options.conditions.push({ key: 'TreeValue', value: $scope.clickFavValue });
                    }

                    usercenterService.getLawsAndTecByLinkID(options, function (response) {
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

                    $scope.pagerAdvice.size = $scope.PageSize;

                    var options = {
                        pageNo: $scope.pagerAdvice.current,
                        pageSize: $scope.pagerAdvice.size,
                        conditions: []
                    };
                    if ($scope.adviceData.Title) {
                        options.conditions.push({ key: 'keyWords', value: $scope.adviceData.Title });
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

                    $scope.pagerLawstandard.size = $scope.PageSize;

                    var options = {
                        pageNo: $scope.pagerLawstandard.current,
                        pageSize: $scope.pagerLawstandard.size,
                        conditions: []
                    };
                    if ($scope.approvedata.KeyWordLaw) {
                        options.conditions.push({ key: 'KeyWords', value: $scope.approvedata.KeyWordLaw });
                    }

                    if($scope.approvedata.organization){
                        options.conditions.push({ key: 'ApproveOrg', value: $scope.approvedata.organization });
                    }
                    options.conditions.push({ key: 'ApproveStatus', value: 2 });
                    options.conditions.push({ key: 'Userid', value: user.id });
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
                        itemDeal.item = { id: item.id };

                        var data = JSON.stringify(itemDeal);

                        $state.go(sRouter, { "data": data });
                    })

                }

                //收藏夹查看
                $scope.CheckByFav = function (item) {
                    //法规
                    if (item.type == 0) {
                        var itemlaw = {
                            id: item.id,
                            clickcount: item.clickcount
                        }
                        regulationService.AddLawstandardCount(itemlaw, function () {
                            var sRouter = "main.regulationsStandardsDetail";

                            var itemDeal = {};
                            itemDeal.type = "check";
                            itemDeal.clickValue = 'fav';
                            itemDeal.item = { id: item.id };

                            var data = JSON.stringify(itemDeal);

                            $state.go(sRouter, { "data": data });
                        })
                    } else {
                        var sRouter = "main.technicalDocumentsDetail";

                        var itemDeal = {};
                        itemDeal.type = "check";
                        itemDeal.clickValue = 'fav';
                        itemDeal.item = { id: item.id };

                        var data = JSON.stringify(itemDeal);

                        $state.go(sRouter, { "data": data });
                    }

                }

                $scope.clickTreeBtn = function (item, type) {

                    switch (type) {
                        case 'delete':

                            var data = {
                                id: item.Id,
                                name: item.Name,
                                parentid: item.ParentID,
                                inputuserid: user.id,
                                modifyuserid: user.id,
                                itemlevel: item.itemlevel,
                                itemlevelcode: item.itemlevelcode,
                                handletype: 'delete'
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

                                        usercenterService.DeleteFavoriteByID(data, function (params) {
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

                        case 'moveDown':
                            var data = {
                                id: item.Id,
                                name: item.Name,
                                parentid: item.ParentID,
                                inputuserid: user.id,
                                modifyuserid: user.id,
                                handletype: 'moveDown',
                                itemlevelcode: item.itemlevelcode
                            }
                            var tet = '下移';
                            addFav(data, tet);
                            break;

                        case 'moveUp':

                            var data = {
                                id: item.Id,
                                name: item.Name,
                                parentid: item.ParentID,
                                inputuserid: user.id,
                                modifyuserid: user.id,
                                handletype: 'moveUp',
                                itemlevelcode: item.itemlevelcode
                            }

                            var tet = '上移';
                            addFav(data, tet);
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
                                        modifyuserid: user.id,
                                        itemlevelcode: item.itemlevelcode,
                                        handletype: 'edit'
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
                                        modifyuserid: user.id,
                                        handletype: 'addDown',
                                        itemlevel: item.itemlevel + 1,
                                        handleitem: { id: item.Id, parentid: item.ParentID }
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
                                        modifyuserid: user.id,
                                        itemlevel: item.itemlevel,
                                        handletype: 'addEqual',
                                        handleitem: { id: item.Id, parentid: item.ParentID }

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

                    if (postData.clickValue == 'fav') {
                        var data = { Name: '收藏夹' };
                        $scope.clickMenu(data);
                    } else if (postData.clickValue == 'approve') {
                        var data = { Name: '待办箱' };
                        $scope.clickMenu(data);
                    } else if (postData.clickValue == 'advice') {
                        var data = { Name: '通知管理' };
                        $scope.clickMenu(data);
                    }

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

                                usercenterService.DismissFavorite(item.favid, item.id, function (params) {
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
                        size: 800,
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

                //查看通知
                $scope.checkAdvice = function (item) {

                    var sRouter = "main.adviceDetails";
                    var itemDeal = {};
                    itemDeal.clickValue = item.id;
                    itemDeal.type = "advice";

                    var data = JSON.stringify(itemDeal);

                    $state.go(sRouter, { "data": data });
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

                //修改密码取消
                $scope.resetPasswordinput = function () {
                    $scope.passworddata.OldPasswWord = "";
                    $scope.passworddata.NewPasswWord = "";
                    $scope.passworddata.ComfirmPasswWord = "";
                }

                $scope.updatePassword = function () {
                    if ($scope.passworddata.NewPasswWord != $scope.passworddata.ComfirmPasswWord) {
                        toaster.pop({ type: 'danger', body: '2次密码输入不一致!' });
                        return;
                    }
                    if ($scope.passworddata.OldPasswWord == $scope.passworddata.NewPasswWord) {
                        toaster.pop({ type: 'danger', body: '新密码不能与原密码一样!' });
                        return;
                    }

                    var oldpasswordjm = md5Service.mdsPassword($scope.passworddata.OldPasswWord);
                    var NewPasswWordjm = md5Service.mdsPassword($scope.passworddata.NewPasswWord);
                    usercenterService.updateUserPassword(user.id, oldpasswordjm, NewPasswWordjm, function (params) {
                        if (params == 200) {
                            toaster.pop({ type: 'success', body: '修改成功' });
                        } else if (params == 403) {
                            toaster.pop({ type: 'danger', body: '原密码输入错误!' });
                        } else {
                            toaster.pop({ type: 'danger', body: '修改失败' });
                        }
                    })

                }
            };

            // 实际运行……
            define_variable();

            initialize();

            define_function();


        }]);
});