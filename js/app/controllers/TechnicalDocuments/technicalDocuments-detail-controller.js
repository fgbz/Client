define(['bootstrap/app', 'utils', 'services/technical-service', 'services/accessory-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('technicalDocuments-detail-controller', ['$stateParams', '$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'technical-service', 'accessory-service', 'http-service',
        function ($stateParams, $rootScope, $scope, $state, toaster, $uibModal, technicalService, accessoryService, http) {

            var postData = $stateParams.data;

            var user = sessionStorage.getItem('loginUser');

            if (user) {
                user = JSON.parse(user);
            }
             $rootScope.$emit("detailCheck", true);
            //变量
            var define_variable = function () {
                $scope.Attachments = [];
            };

            //加载
            var initialize = function () {

                if (postData) {
                    postData = JSON.parse(postData);
                }

                $scope.isDownload = utils.getListItem('技术文档下载', 'menuname', user.menus);

                //获取附件信息
                accessoryService.getAccessoryByDirId(postData.item.id, function (res) {
                    $scope.Attachments = res;
                })

                technicalService.getTechnicalById(postData.item.id, function (params) {
                    $scope.DetaiData = params;
                    $scope.DetaiData.inputdate = utils.parseTime(new Date($scope.DetaiData.inputdate), "YYYY-MM-DD");
                })

            };

            //方法
            var define_function = function () {

                $scope.goState = function (params) {

                    var sRouter = "";

                    if (postData.clickValue == 'home') {
                        sRouter = "main.home";
                        $rootScope.$emit("menustateChange", { value: sRouter, HeadNew: true });
                        $state.go(sRouter);
                    } else if (postData.clickValue == 'fav') {
                        sRouter = "main.userCenter";
                        var itemDeal = {};
                        itemDeal.clickValue = postData.clickValue;

                        var data = JSON.stringify(itemDeal);

                        $state.go(sRouter, { "data": data });

                    } else {
                        sRouter = "main.technicalDocuments";
                        var itemDeal = {};
                        itemDeal.clickValue = postData.clickValue;
                        itemDeal.selectData = postData.selectData;
                        itemDeal.treevalueid = postData.treevalueid;

                        var data = JSON.stringify(itemDeal);

                        $state.go(sRouter, { "data": data });
                    }

                }

                //收藏
                $scope.favorieTec = function () {
                    var url = 'partials/system/modals/favorite.html';
                    var modalInstance = $uibModal.open({

                        templateUrl: url,
                        controller: 'favorite-controller',

                        size: 'sm',
                        resolve: {
                            values: function () {
                                var data = {
                                    id: postData.item.id,
                                    type: 'tec'
                                }
                                return data;
                            }
                        }
                    });

                    modalInstance.result.then(function (res) {
                        $scope.DetaiData.iscollect = res;
                    });
                }


                $scope.downloadAccessory = function (fileId) {
                    accessoryService.downloadAccessory(fileId, "Tec");
                };

                //预览
                $scope.preview = function (fileId) {
                    var url = baseUrl + '/Foundation/Attachment/getPreView?file=' + fileId;

                    window.open('usermanual/web/viewer.html?url=' + http.wrapUrl(url));
                }
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

            };

            // 实际运行……
            define_variable();

            initialize();

            define_function();


        }]);
});