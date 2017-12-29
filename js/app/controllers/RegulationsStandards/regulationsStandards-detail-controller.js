define(['bootstrap/app', 'utils', 'services/regulation-service', 'services/accessory-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('regulationsStandards-detail-controller', ['$stateParams', '$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'regulation-service', 'accessory-service', '$cookies', 'http-service',
        function ($stateParams, $rootScope, $scope, $state, toaster, $uibModal, regulationService, accessoryService, $cookies, http) {

            var postData = $stateParams.data;

            var user = sessionStorage.getItem('loginUser');

            if (user) {
                user = JSON.parse(user);
            }

            var histroyData = [];

            //变量
            var define_variable = function () {
                $scope.Attachments = [];
            };

            //加载
            var initialize = function () {

                if (postData) {
                    postData = JSON.parse(postData);
                }
                //向历史扭转中添加数据
                histroyData.push(postData.clickValue)

                $scope.isDownload = utils.getListItem('法规标准下载', 'menuname', user.menus);

                //获取附件信息
                accessoryService.getAccessoryByDirId(postData.item.id, function (res) {
                    $scope.Attachments = res;
                })

                regulationService.getLawstandardById(postData.item.id, function (params) {
                    $scope.DetaiData = params;
                    $scope.DetaiData.inputdate = utils.parseTime(new Date($scope.DetaiData.inputdate), "YYYY-MM-DD");
                    $scope.DetaiData.modifydate = utils.parseTime(new Date($scope.DetaiData.modifydate), "YYYY-MM-DD");
                })

            };

            //方法
            var define_function = function () {

                $scope.goState = function () {

                    //返回点击查看的界面
                    if (histroyData.length == 1) {
                        var sRouter = "";
                        var itemDeal = {};

                        if (postData.clickValue == 'approve' || postData.clickValue == 'fav') {
                            sRouter = "main.userCenter";
                        } else if (postData.clickValue == 'solr') {
                            sRouter = "main.solr";
                            itemDeal.selectData = postData.selectData;

                            itemDeal.treevalueid = postData.treevalueid;
                        } else if (postData.clickValue == 'home') {
                            sRouter = "main.home";
                            $rootScope.$emit("menustateChange", { value: sRouter, HeadNew: true });
                            $state.go(sRouter);
                        } else {

                            sRouter = "main.regulationsStandardsIndex";
                            itemDeal.selectData = postData.selectData;
                            itemDeal.treemanageid = postData.treemanageid;
                            itemDeal.treevalueid = postData.treevalueid;
                        }

                        itemDeal.clickValue = postData.clickValue;

                        var data = JSON.stringify(itemDeal);

                        $state.go(sRouter, { "data": data });
                    } else {

                        regulationService.getLawstandardById( histroyData[histroyData.length - 1] , function (res) {
                            $scope.DetaiData = res;
                            histroyData.splice(histroyData.length - 1, 1);
                        });
                    }


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
                                    id: postData.item.id,
                                    type: 'law'
                                }
                                return data;
                            }
                        }
                    });

                    modalInstance.result.then(function (res) {
                        $scope.DetaiData.iscollect = res;
                    });
                }

                //点击代替或引用
                $scope.checkRepalceOrRefence = function (params) {

                    //向历史扭转中添加数据
                    histroyData.push($scope.DetaiData.id);

                    regulationService.getLawstandardById(params.id, function (res) {
                        $scope.DetaiData = res;
                        if ($scope.DetaiData.modifydate) {
                            $scope.DetaiData.modifydate = utils.parseTime(new Date($scope.DetaiData.modifydate), "YYYY-MM-DD");
                        }

                    });

                }


                //是否置顶
                $scope.clicksfzd = function (params) {
                    params.istop = params.istop == 1 ? 0 : 1;

                    regulationService.LawstandardIsTop($scope.DetaiData, function () {

                    })
                }

                $scope.downloadAccessory = function (fileId) {
                    accessoryService.downloadAccessory(fileId, "Law");
                };

                //预览
                $scope.preview = function (fileId) {
                    var url = baseUrl + '/Foundation/Attachment/getPreView?file=' + fileId;

                    window.open('usermanual/web/viewer.html?url=' + http.wrapUrl(url));
                }

                $scope.canPreview = function (fileName) {
                    var pos = fileName.lastIndexOf('.');
                    var format = fileName.substring(pos + 1);
                    var picType = ['pdf', 'doc', 'txt','docx'];
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