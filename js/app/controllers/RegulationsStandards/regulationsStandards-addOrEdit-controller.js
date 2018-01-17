define(['bootstrap/app', 'utils', 'services/regulation-service', 'services/accessory-service', 'services/system-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('regulationsStandards-addOrEdit-controller', ['$stateParams', '$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'regulation-service', 'accessory-service', 'system-service', 'http-service', '$cookies', 'ngDialog',
        function ($stateParams, $rootScope, $scope, $state, toaster, $uibModal, regulationService, accessoryService, systemService, http, $cookies, ngDialog) {

            var postData = $stateParams.data;

            var user = sessionStorage.getItem('loginUser');

            if (user) {
                user = JSON.parse(user);
            }

            //变量
            var define_variable = function () {

                $scope.data = {};


                $scope.data.refence = [];
                $scope.data.replace = [];
                $scope.data.summaryinfo = "";
                $scope.Attachments = [];
                $scope.canEdit = true;

            };

            //加载
            var initialize = function () {

                $scope.isLawMaintain = utils.getListItem('法规发布维护', 'menuname', user.menus);

                if (postData) {
                    postData = JSON.parse(postData);
                }

                $scope.localLang = {
                    selectAll: "全选",
                    selectNone: "全不选",
                    reset: "清空",
                    search: "查找发布部门...",
                    nothingSelected: "(无)"
                };

                $scope.isSaving = false;
                var dics = JSON.parse(localStorage.getItem('DicItems'));

                $scope.PublishList = dics.Pub;
                $scope.StateList = dics.State;

                //树
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

                    if (postData.type == 'edit') {

                        $scope.isPublish = postData.item.approvestatus == 3 ? true : false;

                        //维护权限
                        if ($scope.isLawMaintain || postData.item.approvestatus == 1) {
                            $scope.canEdit = true;
                        } else {
                            $scope.canEdit = false;
                        }

                        //获取附件信息
                        accessoryService.getAccessoryByDirId(postData.item.id, function (res) {
                            $scope.Attachments = res;
                        })

                        regulationService.getLawstandardById(postData.item.id, function (params) {
                            $scope.data = params;
                            $scope.data.modifyuserid = user.id;
                            $scope.data.inputdate = utils.parseTime(new Date($scope.data.inputdate), "YYYY-MM-DD");

                            if ($scope.data.releasedate) {
                                $scope.data.releasedate = utils.parseTime(new Date($scope.data.releasedate), "YYYY-MM-DD");
                            }
                            if ($scope.data.impdate) {
                                $scope.data.impdate = utils.parseTime(new Date($scope.data.impdate), "YYYY-MM-DD");
                            }
                            angular.element('.nicEdit-main')[0].innerHTML = $scope.data.summaryinfo;
                            //发布部门
                            if ($scope.data.organization) {
                                $scope.organization = [{ id: $scope.data.organization }];
                            }

                            for (var i = 0; i < $scope.PublishList.length; i++) {
                                if ($scope.organization && $scope.organization.length > 0 && $scope.PublishList[i].id == $scope.organization[0].id) {
                                    $scope.PublishList[i].Selected = true;
                                } else {
                                    $scope.PublishList[i].Selected = false;
                                }
                            }

                        })
                    } else {
                        $scope.canEdit = true;
                        $scope.isPublish = false;
                        $scope.data.inputuserid = user.id;
                        $scope.data.inputusername = user.userrealname;
                        $scope.data.inputorgname = user.orgname;
                        $scope.data.inputdate = utils.format(new Date(), "yyyy-MM-dd");
                    }
                })

            };

            //方法
            var define_function = function () {

                $scope.goState = function () {

                    var sRouter = "main.regulationsStandardsIndex";
                    var itemDeal = {};
                    itemDeal.clickValue = postData.clickValue;
                    itemDeal.selectData = postData.selectData;
                    itemDeal.treemanageid = postData.treemanageid;
                    itemDeal.treevalueid = postData.treevalueid;
                    var data = JSON.stringify(itemDeal);

                    $state.go(sRouter, { "data": data });
                }



                $scope.openUploadModal = function () {

                    var url = 'partials/system/modals/uploadModal.html';
                    var modalInstance = $uibModal.open({

                        templateUrl: url,
                        controller: 'uploadModal-controller',
                        size: 600,
                        resolve: {
                            values: function () {
                                var data = {
                                    userid: user.id,
                                    type: 'Law'
                                }
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (res) {
                        if (res.result) {
                            toaster.pop({ type: 'success', body: '上传成功!' });

                            var fileId = res.Data;
                            $scope.Attachments.push({
                                FileName: res.Message,
                                ID: res.Data,
                            });

                        } else {
                            toaster.pop({ type: 'danger', body: '上传失败!' });
                        };
                    }, function (reason) { }

                    );
                };

                $scope.canPreview = function (fileName) {
                    var pos = fileName.lastIndexOf('.');
                    var format = fileName.substring(pos + 1);
                    var picType = ['pdf', 'doc', 'txt', 'docx'];
                    var res = false;
                    angular.forEach(picType, function (value, key) {
                        if (value == format.toLowerCase()) {
                            res = true;
                        }
                    });
                    return res;
                }


                $scope.openReference = function () {

                    var url = 'partials/system/modals/Reference.html';
                    var modalInstance = $uibModal.open({

                        templateUrl: url,
                        controller: 'reference-controller',
                        size: 800,
                        resolve: {
                            values: function () {
                                var data = {
                                    title: '引用关系'
                                }
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (res) {
                        if (res && res.length > 0) {

                            for (var i = 0; i < res.length; i++) {
                                var flag = false;
                                for (var j = 0; j < $scope.data.refence.length; j++) {

                                    if ($scope.data.refence[j].id == res[i].id) {
                                        flag = true;
                                        break;
                                    }
                                }
                                if (!flag) {
                                    $scope.data.refence.push(res[i]);
                                }

                            }

                        }
                    }, function (reason) { }

                    );
                }

                $scope.deleteRefence = function (params) {
                    for (var i = 0; i < $scope.data.refence.length; i++) {
                        if ($scope.data.refence[i].id == params.id) {
                            $scope.data.refence.splice(i, 1);
                            break;
                        }
                    }
                }

                //代替关系
                $scope.openReplace = function () {

                    var url = 'partials/system/modals/Reference.html';
                    var modalInstance = $uibModal.open({

                        templateUrl: url,
                        controller: 'reference-controller',
                        size: 800,
                        resolve: {
                            values: function () {
                                var data = {
                                    title: '代替关系'
                                }
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (res) {
                        if (res && res.length > 0) {

                            for (var i = 0; i < res.length; i++) {
                                var flag = false;
                                for (var j = 0; j < $scope.data.replace.length; j++) {

                                    if ($scope.data.replace[j].id == res[i].id) {
                                        flag = true;
                                        break;
                                    }
                                }
                                if (!flag) {
                                    $scope.data.replace.push(res[i]);
                                }

                            }

                        }
                    }, function (reason) { }

                    );
                }

                $scope.deleteReplace = function (params) {
                    for (var i = 0; i < $scope.data.replace.length; i++) {
                        if ($scope.data.replace[i].id == params.id) {
                            $scope.data.replace.splice(i, 1);
                            break;
                        }
                    }
                }

                //去掉字符串前后空格
                function Trim(str) {
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                }


                $scope.save = function (params) {


                    systemService.getApproveSetting(function (res) {


                        $scope.isSaving = true;

                        //已发布不再修改状态
                        if ($scope.data.approvestatus != 3) {
                            if (params == 'commit') {
                                if (res == 0) {
                                    $scope.data.approvestatus = 3;
                                } else {
                                    $scope.data.approvestatus = 2;
                                }

                            } else {
                                $scope.data.approvestatus = 1;
                            }
                        }

                        if (!$scope.data.chinesename) {
                            toaster.pop({ type: 'danger', body: '请填写标题!' });
                            $scope.isSaving = false;
                            return;
                        }
                        if (!$scope.data.code) {
                            toaster.pop({ type: 'danger', body: '请填写编号!' });
                            $scope.isSaving = false;
                            return;
                        }
                        if (!$scope.data.lawtype) {
                            toaster.pop({ type: 'danger', body: '请选择类别!' });
                            $scope.isSaving = false;
                            return;
                        }

                        if ($scope.data.releasedate && $scope.data.impdate) {
                            if ($scope.data.releasedate > $scope.data.impdate) {
                                toaster.pop({ type: 'danger', body: '发布日期应小于等于实施日期!' });
                                $scope.isSaving = false;
                                return;
                            }
                        }
                        if ($scope.Attachments.length == 0) {
                            toaster.pop({ type: 'danger', body: '请至少上传一个主附件!' });
                            $scope.isSaving = false;
                            return;
                        }


                        $scope.data.code = Trim($scope.data.code);

                        var fileids = [];

                        for (var i = 0; i < $scope.Attachments.length; i++) {
                            fileids.push($scope.Attachments[i].ID);
                        }

                        $scope.data.fileids = fileids;

                        $scope.data.summaryinfo = $(".nicEdit-main").html();

                        //发布部门
                        if ($scope.organization && $scope.organization.length > 0) {
                            $scope.data.organization = $scope.organization[0].id;
                        } else {
                            $scope.data.organization = "";
                        }

                        regulationService.SaveOrUpdateLawstandard($scope.data, function (response) {
                            if (response == 200) {
                                toaster.pop({ type: 'success', body: '保存成功!' });

                                $scope.goState("second");
                            } else if (response == 461) {
                                toaster.pop({ type: 'danger', body: '编号重复!' });
                            } else {
                                toaster.pop({ type: 'danger', body: '保存失败!' });
                            }
                            $scope.isSaving = false;

                        })
                    })


                }

                //提交
                $scope.commit = function (params) {
                    $scope.text = "确定提交吗？";
                    var modalInstance = ngDialog.openConfirm({
                        templateUrl: 'partials/_confirmModal.html',
                        appendTo: 'body',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope,
                        size: 400,
                        controller: function ($scope) {
                            $scope.ok = function () {

                                $scope.save(params);

                                $scope.closeThisDialog(); //关闭弹窗
                            };
                            $scope.cancel = function () {
                                $scope.closeThisDialog(); //关闭弹窗
                            }
                        }
                    });
                }

                $scope.downloadAccessory = function (fileId) {
                    accessoryService.downloadAccessory(fileId, "Law");
                };

                //删除附件
                $scope.deletefile = function (params) {
                    var data = [];
                    data.push(params);
                    accessoryService.removeAccessory(data, function (res) {
                        if (res) {
                            toaster.pop({ type: 'success', body: '删除成功!' });

                            for (var i = 0; i < $scope.Attachments.length; i++) {
                                if ($scope.Attachments[i].ID == params) {
                                    $scope.Attachments.splice(i, 1);
                                    break;
                                }
                            }
                        } else {
                            toaster.pop({ type: 'danger', body: '删除失败!' });
                        }

                    })
                };

                //预览
                $scope.preview = function (fileId) {


                    var url = baseUrl + '/Foundation/Attachment/getPreView?file=' + fileId;

                    window.open('usermanual/web/viewer.html?url=' + http.wrapUrl(url));



                };
            }
            // 实际运行……
            define_variable();

            initialize();

            define_function();


        }]);
});