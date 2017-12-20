define(['bootstrap/app', 'utils', 'services/technical-service', 'services/accessory-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('technicalDocuments-detail-controller', ['$stateParams', '$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'technical-service', 'accessory-service',
        function ($stateParams, $rootScope, $scope, $state, toaster, $uibModal, technicalService, accessoryService) {

            var postData = $stateParams.data;

            var user = sessionStorage.getItem('loginUser');

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

                var isDownload = utils.getListItem('技术文档下载', 'menuname', user.menus);

                //获取附件信息
                accessoryService.getAccessoryByDirId(postData.item.id, function (res) {
                    $scope.Attachments = res;
                })

                technicalService.getTechnicalById(postData.item, function (params) {
                    $scope.DetaiData = params;
                    $scope.DetaiData.inputdate = utils.parseTime(new Date($scope.DetaiData.inputdate), "YYYY-MM-DD");
                })

            };

            //方法
            var define_function = function () {

                $scope.goState = function (params) {

                    var sRouter = "main.technicalDocuments";

                    var itemDeal = {};
                    itemDeal.clickValue = postData.clickValue;


                    var data = JSON.stringify(itemDeal);

                    $state.go(sRouter, { "data": data });
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