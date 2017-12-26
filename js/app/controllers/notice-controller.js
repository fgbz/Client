define(['bootstrap/app', 'utils', 'app/config-manager', 'services/usercenter-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('notice-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'usercenter-service', '$stateParams',
        function ($rootScope, $scope, $state, toaster, $uibModal, usercenterService, $stateParams) {

            var postData = $stateParams.data;

            //变量
            var define_variable = function () {

                $scope.pager = {
                    size: 10,
                    current: 1
                }
            };

            //加载
            var initialize = function () {

                //获取通知列表
                $scope.selectAdvice = function (isPaging) {
                    $scope.isLoaded = false;

                    //通过当前高度计算每页个数
                    var pagesize = parseInt((window.innerHeight - 200) / 40);

                    if (!isPaging) {
                        $scope.pager.current = 1;
                    }

                    $scope.pager.size = pagesize;

                    var options = {
                        pageNo: $scope.pager.current,
                        pageSize: $scope.pager.size,
                        conditions: []
                    };

                    usercenterService.getAdviceList(options, function (response) {
                        $scope.isLoaded = true;
                        $scope.items = response.CurrentList;
                        $scope.pager.total = response.RecordCount;

                        if ($scope.items != null && $scope.items.length > 0) {
                            if (postData) {
                                postData = JSON.parse(postData);
                                $scope.clickvalue = postData.clickValue;
                            } else {
                                $scope.clickvalue = $scope.items[0].id;
                            }
                        }

                    })
                }
                $scope.selectAdvice();

            };

            //方法
            var define_function = function () {

                $scope.goState = function () {

                    var sRouter = "main.home";
                    $rootScope.$emit("menustateChange", { value: sRouter, HeadNew: true });
                    $state.go(sRouter);
                }
                //调到通知详细界面
                $scope.showAdvice = function (item) {

                    var sRouter = "main.adviceDetails";
                    var itemDeal = {};
                    itemDeal.clickValue = item.id;
                    itemDeal.type = "notice";

                    var data = JSON.stringify(itemDeal);

                    $state.go(sRouter, { "data": data });

                }


            };

            // 实际运行……
            define_variable();

            initialize();

            define_function();


        }]);
});