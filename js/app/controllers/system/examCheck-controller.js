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
                            toaster.pop({ type: 'danger', body: '审核不通过必须填写说明！' });
                            return;
                        }

                    }
                    $scope.isSaving = true;
                    usercenterService.SaveApprove($scope.data, function (params) {
                        if (params == 200) {
                            toaster.pop({ type: 'success', body: '审核成功！' });


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

                                //不通过
                                if ($scope.data.status == 0) {
                                    systemService.getUserMailById($scope.law.inputuserid,function (res) {
                                        sendMail(MailData.MailServerAddress, MailData.HairBoxAddress, res.mail, MailData.NoPassTheme, MailData.NoPassText);
                                    })

                                } else {
                                    sendMail(MailData.MailServerAddress, MailData.HairBoxAddress, MailData.AllEmail, MailData.PublishTheme, MailData.PublishText);
                                }


                            });
                        } else {
                            toaster.pop({ type: 'waring', body: '审核失败！' });
                        }
                        $scope.isSaving = false;
                    })

                }

                var sendMail = function (url, HairBoxAddress, Email, Theme, Text) {
                    $.ajax({
                        type: "Get",
                        url: url,
                        data: { 'mfrom': HairBoxAddress, 'mto': Email, 'subj': Theme, 'body': Text },
                        dataType: "jsonp",
                        // timeout: 10000,
                        contentType: "application/json;charset=utf-8",
                        success: function (result) {
                            if (result == 'OK') {
                                toaster.pop({ type: 'success', body: '邮件发送成功!' });
                                $modalInstance.close(200);
                            }

                        },
                        error: function (err, textStatus) {
                            toaster.pop({ type: 'danger', body: '邮件发送失败!' });
                            $modalInstance.close(200);
                        }
                    })

                    var head = document.head || $('head')[0] || document.documentElement; // code from jquery
                    var script = $(head).find('script')[0];
                    script.onerror = function (evt) {
                        toaster.pop({ type: 'danger', body: '邮件发送失败!' });
                        $modalInstance.close(200);

                        // do some clean

                        // delete script node
                        if (script.parentNode) {
                            script.parentNode.removeChild(script);
                        }
                        // delete jsonCallback global function
                        var src = script.src || '';
                        var idx = src.indexOf('jsoncallback=');
                        if (idx != -1) {
                            var idx2 = src.indexOf('&');
                            if (idx2 == -1) {
                                idx2 = src.length;
                            }
                            var jsonCallback = src.substring(idx + 13, idx2);
                            delete window[jsonCallback];
                        }
                    };
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