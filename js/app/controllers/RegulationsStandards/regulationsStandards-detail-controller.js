define(['bootstrap/app', 'utils', 'services/regulation-service', 'services/accessory-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('regulationsStandards-detail-controller', ['$stateParams', '$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'regulation-service', 'accessory-service',
        function ($stateParams, $rootScope, $scope, $state, toaster, $uibModal, regulationService, accessoryService) {

            var postData = $stateParams.data;

            var user = localStorage.getItem("loginUser");

            if (user) {
                user = JSON.parse(user);
            }

            //变量
            var define_variable = function () {
                $scope.Attachments = [];
            };

            //加载
            var initialize = function () {

                if (postData) {
                    postData = JSON.parse(postData);
                }

                var isDownload = utils.getListItem('下载', 'menuname', user.menus);
                var isSup = utils.getListItem('超级管理员', 'menuname', user.menus);

                //获取附件信息
                accessoryService.getAccessoryByDirId(postData.item.id, function (res) {
                    $scope.Attachments = res;
                })

                regulationService.getLawstandardById(postData.item, function (params) {
                    $scope.DetaiData = params;
                    $scope.DetaiData.inputdate = utils.parseTime(new Date($scope.DetaiData.inputdate), "YYYY-MM-DD");
                })

            };

            //方法
            var define_function = function () {

                $scope.goState = function () {

                    var sRouter = "";
                    if (postData.clickValue == 'approve' || postData.clickValue == 'fav') {
                        sRouter = "main.userCenter";
                    }else {
                        sRouter = "main.regulationsStandardsIndex";
                    }


                    var itemDeal = {};
                    itemDeal.clickValue = postData.clickValue;

                    var data = JSON.stringify(itemDeal);

                    $state.go(sRouter, { "data": data });
                }

                //收藏
                $scope.favorieLaw = function () {
                    var url = 'partials/system/modals/favorite.html';
                    var modalInstance = $uibModal.open({

                        templateUrl: url,
                        controller: 'favorite-controller',

                        size: 'sm',
                        resolve: {
                            values: function () {
                                var data = {
                                    id: postData.item.id
                                }
                                return data;
                            }
                        }
                    });
                }

                //点击替代
                $scope.checkRepalce = function (params) {
                    regulationService.getLawstandardById(params, function (res) {
                        $scope.DetaiData = res;
                    });

                }

                //点击引用
                $scope.checkRefence = function (params) {
                    regulationService.getLawstandardById(params, function (res) {
                        $scope.DetaiData = res;
                    });

                }


                //是否置顶
                $scope.clicksfzd = function (params) {
                    params.istop = params.istop == 1 ? 0 : 1;

                    regulationService.LawstandardIsTop($scope.DetaiData, function () {

                    })
                }

                $scope.downloadAccessory = function (fileId) {
                    accessoryService.downloadAccessory(fileId);
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