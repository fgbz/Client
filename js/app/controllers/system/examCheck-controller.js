define(['bootstrap/app', 'utils', 'app/config-manager', 'services/usercenter-service', 'services/system-service', 'services/regulation-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('examCheck-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', '$uibModalInstance', 'values', 'usercenter-service', '$cookies', 'system-service', 'regulation-service',
        function ($rootScope, $scope, $state, toaster, $uibModal, $modalInstance, values, usercenterService, $cookies, systemService, regulationService) {


            var user = sessionStorage.getItem('loginUser');
            if (user) {
                user = JSON.parse(user);
            }
            //变量
            var define_variable = function () {
                $scope.data = {};
                $scope.data.id = "";
                $scope.data.approveUserID = user.id;
                $scope.data.username = user.userrealname;
                $scope.data.inputorgname = user.orgname;
                $scope.data.approveDate = utils.format(new Date(), "yyyy-MM-dd");
                $scope.data.status = 1;
                $scope.data.lawstandardID = values.item.id;
                $scope.isCheck = values.isCheck;

            };

            //加载
            var initialize = function () {
                $scope.law = {};

                usercenterService.getApproveHistroy($scope.data.lawstandardID, function (params) {
                    $scope.histroyItems = params;
                })

                regulationService.getDetailLawstandardById($scope.data.lawstandardID, function (params) {
                    $scope.law = params;
                })


            };

            //方法
            var define_function = function () {


                $scope.ok = function () {
                    if ($scope.data.status == 0) {
                        if (!$scope.data.content) {
                            toaster.pop({ type: 'danger', body: '审核不通过必须填写说明！' ,timeout:5000});
                            return;
                        }

                    }
                    $scope.isSaving = true;
                    usercenterService.SaveApprove($scope.data, function (params) {
                        if (params == 200) {
                            toaster.pop({ type: 'success', body: '审核成功！',timeout:5000 });

                            systemService.getSendMailSetting(function (mailres) {
                                if (mailres == 1) {
                                    systemService.getMailSetting(function (res) {
                                        var MailData = {
                                            MailServerAddress: res.MailServerAddress,
                                            HairBoxAddress: res.HairBoxAddress,
                                            Theme: res.Theme + "(" + $scope.law.code + ")",
                                            Text: res.Text,
                                            Email: res.Email,
                                            NoPassTheme: res.NoPassTheme,
                                            NoPassText: res.NoPassText,
                                            PublishTheme: res.PublishTheme,
                                            PublishText: res.PublishText,
                                            AllEmail: res.AllEmail
                                        }

                                        if ($scope.data.status == 0) {
                                            MailData.type = 1;
                                            systemService.getUserMailById($scope.law.inputuserid, function (res) {
                                                MailData.backMail = res.mail;
                                                $rootScope.$emit("SendMail", MailData);
                                                $scope.isSaving = false;
                                                $modalInstance.close(200);
                                            })
                                        } else {
                                            MailData.type = 3;
                                            $rootScope.$emit("SendMail", MailData);
                                            $scope.isSaving = false;
                                            $modalInstance.close(200);
                                        }


                                    });
                                } else {
                                    $scope.isSaving = false;
                                    $modalInstance.close(200);
                                }

                            });

                        } else {
                            $scope.isSaving = false;
                            toaster.pop({ type: 'waring', body: '审核失败！',timeout:5000 });
                        }

                    })

                }

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            // 实际运行……
            define_variable();

            initialize();

            define_function();


        }]);
});