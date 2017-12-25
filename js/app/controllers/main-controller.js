define(['bootstrap/app', 'utilities/cryto', 'ctrls/system/modals/logout-controller', 'services/dictionary-service', 'services/staff-service'], function (app) {
    'use strict';

    var cryto = require('utilities/cryto');

    var config = require('app/config-manager');

    var baseUrl = config.baseUrl();

    app.controller('main-controller', ['$rootScope', '$scope', '$cookies', '$state', '$uibModal',
        '$timeout', '$cacheFactory', 'toaster', 'ngDialog', 'dictionary-service', 'staff-service', 'http-service',
        function ($rootScope, $scope, $cookies, $state, $uibModal,
            $timeout, $cacheFactory, toaster, ngDialog, dictionaryService, staffService, http) {

            $scope.baseUrl = baseUrl;

            var user = sessionStorage.getItem('loginUser');

            if (user) {
                user = JSON.parse(user);
            }

            $scope.loginUser = user;


            var init = function () {
                $scope.happend_date_options = {
                    showWeeks: false
                }
                $scope.mainMenu = [

                    {
                        name: '系统设置',
                        state: 'main.systemSetup',
                        show: false
                    },
                    {
                        name: '用户中心',
                        state: 'main.userCenter',
                        show: false
                    },
                    {
                        name: '技术文档',
                        state: 'main.technicalDocuments',
                        show: false
                    },
                    {
                        name: '法规标准',
                        state: 'main.regulationsStandardsIndex',
                        show: false
                    },
                    {
                        name: '首页',
                        state: 'main.home',
                        show: true
                    }

                ];

                $scope.menustate = "";

                angular.forEach($scope.mainMenu, function (value, key) {

                    if (value.state == $state.current.name) {
                        $scope.menustate = value.state;
                    }


                });


                //设置权限
                if (user && user.menus) {

                    for (var i = 0; i < $scope.mainMenu.length; i++) {

                        for (var j = 0; j < user.menus.length; j++) {
                            if (user.menus[j].menuname.indexOf($scope.mainMenu[i].name) != -1) {
                                $scope.mainMenu[i].show = true;
                                break;
                            }
                        }
                    }

                }

                //登录就有用户中心
                if (user) {
                    $scope.mainMenu[1].show = true;
                }



                $scope.HeadNew = true;

                //初始化字典
                dictionaryService.GetAllDic(function (res) {

                    localStorage.setItem('DicItems', JSON.stringify(res));
                    // $rootScope.PageSize = res.PageSize;
                })
            }

            init();

            $scope.menuClick = function (item) {
                if (item.state) {
                    $scope.menustate = item.state;

                    if ($scope.menustate == "main.home") {
                        $scope.HeadNew = true;
                    } else {
                        $scope.HeadNew = false;
                    }
                    $state.go(item.state);
                }
            }


            $rootScope.$on('menustateChange', function (params, value) {

                if (value.value != null) {
                    $scope.menustate = value.value;
                }
                $scope.HeadNew = value.HeadNew;
            });

            var setMenuName = function (params) {
                $scope.menustate = params;
            }


            if ($state.current.name == 'main.home') {
                $scope.HeadNew = true;
            } else {
                $scope.HeadNew = false;
            }


            // 注销
            $scope.logout = function () {
                $scope.text = "确定要退出系统吗？";
                var modalInstance = ngDialog.openConfirm({
                    templateUrl: 'partials/_confirmModal.html',
                    appendTo: 'body',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope,
                    size: 400,
                    controller: function ($scope) {
                        $scope.ok = function () {

                            $cookies.remove("AUTH_ID");
                            sessionStorage.removeItem('loginUser');

                            if ($scope.menustate == "main.home") {
                                location.reload();
                            } else {
                                $cookies.put('reload', true);
                                var sRouter = "main.home";
                                $state.go(sRouter);
                            }


                            $scope.closeThisDialog(); //关闭弹窗
                        };
                        $scope.cancel = function () {
                            $scope.closeThisDialog(); //关闭弹窗
                        }
                    }
                });


            };

            $scope.login = function () {
                var url = 'partials/system/modals/login.html';
                var modalInstance = $uibModal.open({

                    templateUrl: url,
                    controller: 'login-controller',
                    size: 'sm',
                    resolve: {
                        values: function () {


                            var data = {


                            }
                            return data;
                        }
                    }
                });
            }

        }]);

    //确认框
    app.controller('confirm-controller', ['$scope', '$uibModalInstance', 'values', function ($scope, $modalInstance, values) {
        $scope.text = values.mes;

        $scope.ok = function () {
            var isSure = true;
            $modalInstance.close(isSure);
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);



    //附件预览modal         
    app.controller('previewModal-controller', ['$scope', '$uibModalInstance', 'imgId', function ($scope, $modalInstance, imgId) {

        $scope.currentIndex = imgId.currentIndex;

        $scope.imgs = imgId.ids;

        $scope.imgUrl = baseUrl + "/Storage/GetImageFile?fileId=" + imgId.ids[$scope.currentIndex];

        $scope.back = function () {
            if ($scope.currentIndex == 0) {

            } else {
                $scope.currentIndex -= 1;
            }
            $scope.imgUrl = baseUrl + "/Storage/GetImageFile?fileId=" + imgId.ids[$scope.currentIndex];
        };
        $scope.next = function () {
            if ($scope.currentIndex < imgId.ids.length - 1) {
                $scope.currentIndex += 1;
            } else { }
            $scope.imgUrl = baseUrl + "/Storage/GetImageFile?fileId=" + imgId.ids[$scope.currentIndex];
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }]);

    //附件上传modal
    app.controller('uploadModal-controller', ['$scope', 'Upload', '$timeout', '$uibModalInstance', 'values', 'accessory-service', 'http-service', function ($scope, Upload, $timeout, $modalInstance, values, accessoryService, http) {
        // upload later on form submit or something similar

        $scope.type = values.type;

        $scope.submit = function () {


            if ($scope.form.file.$valid && $scope.file) {

                if ($scope.file.size > 10 * 1024 * 1024) {
                    $scope.warningMessage = '请上传小于10MB的文件。';
                    return;
                }
                if (!$scope.displayName) {
                    $scope.warningMessage = '请填写附件显示名称';
                    return;
                } else if ($scope.displayName.length > 100) {
                    $scope.warningMessage = '显示名称不得超过100个字符';
                    return;
                }
                if (values.uploadType == 'base64') {
                    $scope.upload2($scope.file);
                } else {
                    $scope.upload($scope.file);
                }

            } else {
                if ($scope.type == 'Law') {
                    $scope.warningMessage = '请上传DOC,DOCX,PDF,txt格式文件。';
                }else{
                    $scope.warningMessage = '请选择文件。';
                }

                return;
            }
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            $scope.displayName = '';
            document.getElementById('uploader_input').value = '';
        };
        $scope.defaultName = function (file) {
            if (file && file.name) {

                $scope.displayName = file.name;
            }

        };

        // upload on file select or drop
        $scope.upload = function (file) {

            var url = baseUrl + '/Foundation/Attachment/uploadWithNoThum?userid=' + values.userid+"&module="+values.type;

            Upload.upload({
                url: http.wrapUrl(url),
                data: { file: file, 'username': $scope.username },
                removeAfterUpload: true,
            }).then(function (resp) {
                //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                if (resp.data.Success) {
                    $scope.uploadResult = {
                        result: true,
                        Data: resp.data.FileID,
                        Message: resp.data.FileName
                    };
                } else {
                    $scope.uploadResult = {
                        result: false,
                        //fileName: response.File.Name
                    };
                }
                $modalInstance.close($scope.uploadResult);
                //清空数据
                $scope.displayName = '';
                document.getElementById('uploader_input').value = '';
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //console.log('progress: ' + $scope.progressPercentage + '% ' + evt.config.data.file.name);
            });

        };
        $scope.upload2 = function (file) {
            var reader = new FileReader();
            reader.onload = function () {
                $scope.progressPercentage = parseInt(100.0 * 1);
                var base64File = this.result;
                $timeout(function () {
                    $modalInstance.close(base64File);
                }, 900);
            };
            reader.readAsDataURL(file);
        }
    }]);

});