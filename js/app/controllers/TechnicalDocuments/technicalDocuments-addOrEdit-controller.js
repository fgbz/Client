define(['bootstrap/app', 'utils', 'services/technical-service', 'services/accessory-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('technicalDocuments-addOrEdit-controller', ['$stateParams', '$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'technical-service', 'accessory-service', '$cookies', 'ngDialog', 'http-service',
        function ($stateParams, $rootScope, $scope, $state, toaster, $uibModal, technicalService, accessoryService, $cookies, ngDialog, http) {

            var postData = $stateParams.data;


            var user = sessionStorage.getItem('loginUser');

            if (user) {
                user = JSON.parse(user);
            }
            //变量
            var define_variable = function () {

                $scope.data = {};
                $scope.data.summaryinfo = "";
                $scope.Attachments = [];

            };

            //加载
            var initialize = function () {

                if (postData) {
                    postData = JSON.parse(postData);
                }

                $scope.isSaving = false;


                //树
                technicalService.SelectTechnicalType(function (params) {
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

                        $scope.isPublish = postData.item.approvestatus == 2 ? true : false;

                        //获取附件信息
                        accessoryService.getAccessoryByDirId(postData.item.id, function (res) {
                            $scope.Attachments = res;
                        })

                        technicalService.getTechnicalById(postData.item.id, function (params) {
                            $scope.data = params;
                            $scope.data.modifyuserid = user.id;
                            $scope.data.inputdate = utils.parseTime(new Date($scope.data.inputdate), "YYYY-MM-DD");

                            if ($scope.data.releasedate) {
                                $scope.data.releasedate = utils.parseTime(new Date($scope.data.releasedate), "YYYY-MM-DD");
                            }
                            angular.element('.nicEdit-main')[0].innerHTML = $scope.data.summaryinfo;

                        })
                    } else {
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

                    var sRouter = "main.technicalDocuments";

                    var itemDeal = {};
                    itemDeal.selectData = postData.selectData;
                    itemDeal.treevalueid = postData.treevalueid;
                    itemDeal.clickValue = postData.clickValue;
                    var data = JSON.stringify(itemDeal);

                    $state.go(sRouter, { "data": data });
                }



                $scope.openUploadModal = function () {

                    var url = 'partials/system/modals/uploadModalTec.html';
                    var modalInstance = $uibModal.open({

                        templateUrl: url,
                        controller: 'uploadModal-controller',
                        size: 600,
                        resolve: {
                            values: function () {
                                var data = {
                                    userid: user.id,
                                    type: 'Tec'
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

                //去掉字符串前后空格
                function Trim(str) {
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                }


                $scope.save = function (params) {

                    $scope.isSaving = true;

                    //已发布不再修改状态
                    if ($scope.data.approvestatus != 2) {
                        if (params == 'commit') {
                            $scope.data.approvestatus = 2;
                        } else {
                            $scope.data.approvestatus = 1;
                        }
                    }

                    if (!$scope.data.chinesename) {
                        toaster.pop({ type: 'danger', body: '请填写标题!' });
                        $scope.isSaving = false;
                        return;
                    }

                    if (!$scope.data.tectype) {
                        toaster.pop({ type: 'danger', body: '请选择类别!' });
                        $scope.isSaving = false;
                        return;
                    }

                    if ($scope.Attachments.length == 0) {
                        toaster.pop({ type: 'danger', body: '请至少上传一个主附件!' });
                        $scope.isSaving = false;
                        return;
                    }
                    var fileids = [];

                    for (var i = 0; i < $scope.Attachments.length; i++) {
                        fileids.push($scope.Attachments[i].ID);
                    }

                    $scope.data.fileids = fileids;

                    if ($scope.data.code) {
                        $scope.data.code = Trim($scope.data.code);
                    }

                    $scope.data.chinesename = Trim($scope.data.chinesename);
                    $scope.data.summaryinfo = $(".nicEdit-main").html();

                    technicalService.SaveOrUpdateTechnical($scope.data, function (response) {

                        if (response == 200) {
                            toaster.pop({ type: 'success', body: '保存成功!' });
                            $scope.goState("second");
                        } else if (response == 461) {
                            toaster.pop({ type: 'danger', body: '标题重复!' });
                        } else {
                            toaster.pop({ type: 'danger', body: '保存失败!' });
                        }
                        $scope.isSaving = false;

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
                    accessoryService.downloadAccessory(fileId, "Tec");
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
                }

            };

            // 实际运行……
            define_variable();

            initialize();

            define_function();


        }]);
});