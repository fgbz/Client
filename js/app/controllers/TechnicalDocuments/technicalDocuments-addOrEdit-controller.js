define(['bootstrap/app', 'utils', 'services/technical-service', 'services/accessory-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('technicalDocuments-addOrEdit-controller', ['$stateParams', '$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'technical-service', 'accessory-service',
        function ($stateParams, $rootScope, $scope, $state, toaster, $uibModal, technicalService, accessoryService) {

            var postData = $stateParams.data;


            var user = localStorage.getItem("loginUser");

            if (user) {
                user = JSON.parse(user);
            }
            //变量
            var define_variable = function () {

                $scope.data = {};

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

                        //获取附件信息
                        accessoryService.getAccessoryByDirId(postData.item.id, function (res) {
                            $scope.Attachments = res;
                        })

                        technicalService.getTechnicalById(postData.item, function (params) {
                            $scope.data = params;
                            $scope.data.modifyuserid = user.id;
                            $scope.data.inputdate = utils.parseTime(new Date($scope.data.inputdate), "YYYY-MM-DD");
                            
                            if ($scope.data.releasedate) {
                                $scope.data.releasedate = utils.parseTime(new Date($scope.data.releasedate), "YYYY-MM-DD");
                            }


                        })
                    } else {
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

                    itemDeal.clickValue = postData.clickValue;
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
                    var picType = ['pdf'];
                    var res = false;
                    angular.forEach(picType, function (value, key) {
                        if (value == format.toLowerCase()) {
                            res = true;
                        }
                    });
                    return res;
                }


                $scope.save = function (params) {

                    $scope.isSaving = true;

                    if (params == 'commit') {
                        $scope.data.approvestatus = 2;
                    } else {
                        $scope.data.approvestatus = 1;
                    }

                    if (!$scope.data.tectype) {
                        toaster.pop({ type: 'danger', body: '请选择类别!' });
                        return;
                    }
                    var fileids = [];

                    for (var i = 0; i < $scope.Attachments.length; i++) {
                        fileids.push($scope.Attachments[i].ID);
                    }

                    $scope.data.fileids = fileids;

                    technicalService.SaveOrUpdateTechnical($scope.data, function (response) {

                        toaster.pop({ type: 'success', body: '保存成功!' });
                        $scope.isSaving = false;

                        $scope.goState("second");

                    })

                }

                $scope.downloadAccessory = function (fileId) {
                    accessoryService.downloadAccessory(fileId);
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
                    window.open('usermanual/web/viewer.html?url=' + baseUrl + '/Foundation/Attachment/Download?file=' + fileId + '&AUTH_ID=' + '1');
                }

            };

            // 实际运行……
            define_variable();

            initialize();

            define_function();


        }]);
});