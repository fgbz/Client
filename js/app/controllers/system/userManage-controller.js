define(['bootstrap/app', 'utils', 'services/system-service', 'services/md5-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('userManage-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', '$uibModalInstance', 'values', 'system-service', 'md5-service', '$cookies',
        function ($rootScope, $scope, $state, toaster, $uibModal, $modalInstance, values, systemService, md5Service, $cookies) {



            var user = sessionStorage.getItem('loginUser');

            if (user) {
                user = JSON.parse(user);
            }

            //变量
            var define_variable = function () {
                $scope.dutyList = [
                    { code: 0, name: '普通员工' },
                    { code: 1, name: '领导' },
                ]

            };

            //加载
            var initialize = function () {

                $scope.title = values.Title;

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
                        $scope.data = angular.copy(values.dataUser);

                        $scope.data.inputuserid = user.id;

                        if (!$scope.data.duty) {
                            $scope.data.duty = 0;
                        }

                        $scope.checkPassword = angular.copy(values.dataUser);

                        $scope.passwordSure = $scope.checkPassword.password;

                        $scope.isCheck = values.isCheck;

                        systemService.getAllRoles(function (res) {
                            $scope.roleItems = res;
                            //绑定选中项
                            if ($scope.data.roles != null && $scope.data.roles.length > 0) {
                                for (var i = 0; i < $scope.roleItems.length; i++) {
                                    var flag = false;
                                    for (var j = 0; j < $scope.data.roles.length; j++) {
                                        if ($scope.roleItems[i].id == $scope.data.roles[j].id) {
                                            flag = true;
                                            break;
                                        }
                                    }
                                    $scope.roleItems[i].ischeck = flag ? true : false;
                                }
                            }
                        })

                    })
                };

                $scope.initOrg();

            };

            //方法
            var define_function = function () {

                $scope.clickSingle = function (item) {
                    if (item.ischeck) {
                        item.ischeck = false;
                    } else {
                        item.ischeck = true;
                    }
                }

                $scope.ok = function () {

                    var postdata = angular.copy($scope.data);

                    //确认密码
                    if (postdata.password != $scope.passwordSure) {
                        toaster.pop({ type: 'danger', body: '2次输入密码不一致!' ,timeout:0});
                        $scope.passwordSure = "";
                        return;
                    }

                    var countChar = 0;
                    var countNumber = 0;
                    var str = postdata.password;
                    for (var i = 0; i < str.length; i++) {
                        var c = str.charAt(i);
                        if (c >= 'A' && c <= 'Z') {
                            countChar++;
                        }
                        if (c >= 'a' && c <= 'z') {
                            countChar++;
                        }
                        if (c >= '0' && c <= '9') {
                            countNumber++;
                        }
                    }
                    if (countChar == 0 || countNumber == 0) {
                        toaster.pop({ type: 'danger', body: '密码必须包含数字与字符!',timeout:0 });
                        return;
                    }
                    //验证密码格式
                    if (postdata.password.length < 6) {
                        toaster.pop({ type: 'danger', body: '密码长度不能小于6位!',timeout:0 });
                        return;
                    }
                    postdata.roles = [];

                    for (var i = 0; i < $scope.roleItems.length; i++) {
                        if ($scope.roleItems[i].ischeck) {
                            postdata.roles.push($scope.roleItems[i]);
                        }
                    }


                    if ($scope.checkPassword.password != postdata.password) {
                        postdata.password = md5Service.mdsPassword(postdata.password);
                    }


                    systemService.SaveOrUpdateUser(postdata, function (params) {
                        if (params == 200) {
                            toaster.pop({ type: 'success', body: $scope.title + '成功!' ,timeout:0});
                            $modalInstance.close(params);
                        } else if (params == 461) {
                            toaster.pop({ type: 'danger', body: '用户名重复!' ,timeout:0});
                        } else {
                            toaster.pop({ type: 'danger', body: $scope.title + '失败!' ,timeout:0});
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