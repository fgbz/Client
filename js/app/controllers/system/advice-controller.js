define(['bootstrap/app', 'utils', 'services/usercenter-service', 'services/accessory-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('advice-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', '$uibModalInstance', 'values', 'usercenter-service', '$cookies', 'accessory-service',
        function ($rootScope, $scope, $state, toaster, $uibModal, $modalInstance, values, usercenterService, $cookies, accessoryService) {

            var user = sessionStorage.getItem('loginUser');

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

                $scope.title = values.Title;
                $scope.isCheck = values.isCheck;

                if (values.id) {
                    //初始化
                    usercenterService.GetAdviceByID(values.id, function (res) {
                        $scope.data = res;
                        $scope.data.inputdate = utils.parseTime(new Date($scope.data.inputdate), "YYYY-MM-DD hh:mm:ss");
                        $scope.data.modifyuserid = user.id;
                        angular.element('.nicEdit-main')[0].innerHTML = $scope.data.details;
                    })
                } else {

                    $scope.data.id = "";
                    $scope.data.inputuserid = user.id;
                    $scope.data.orgname = user.orgname;
                    $scope.data.inputdate = utils.parseTime(new Date(), "YYYY-MM-DD hh:mm:ss");
                    $scope.data.details = "";
                }


            };

            //方法
            var define_function = function () {


                $scope.ok = function () {
                    if (!$scope.data.title) {
                        toaster.pop({ type: 'danger', body: '请填写标题！' });
                        return;

                    }

                    $scope.data.details = $(".nicEdit-main").html();

                    if (!$scope.data.details) {
                        toaster.pop({ type: 'danger', body: '请填写内容！' });
                        return;

                    }

                    var fileids = [];

                    for (var i = 0; i < $scope.Attachments.length; i++) {
                        fileids.push($scope.Attachments[i].ID);
                    }

                    $scope.data.fileids = fileids;

                    var requestData = angular.copy($scope.data);
                    //不传录入时间到服务端
                    delete requestData.inputdate;
                    usercenterService.SaveOrUpdateAdvice(requestData, function (params) {
                        if (params == 200) {
                            toaster.pop({ type: 'success', body: $scope.title + '成功！' });
                            $modalInstance.close(params);

                        } else {
                            toaster.pop({ type: 'danger', body: $scope.title + '失败！' });
                        }
                    })


                }

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

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
                                    type: 'Advice'
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
                $scope.downloadAccessory = function (fileId) {
                    accessoryService.downloadAccessory(fileId, "advice");
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

            };

            // 实际运行……
            define_variable();

            initialize();

            define_function();


        }]);
});