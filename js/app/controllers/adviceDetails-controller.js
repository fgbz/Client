define(['bootstrap/app', 'utils', 'app/config-manager', 'services/usercenter-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('adviceDetails-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'usercenter-service', '$stateParams',
        function ($rootScope, $scope, $state, toaster, $uibModal, usercenterService, $stateParams) {

            var postData = $stateParams.data;

            //变量
            var define_variable = function () {

            };

            //加载
            var initialize = function () {

                if (postData) {
                    postData = JSON.parse(postData);
                }
                usercenterService.GetAdviceByID(postData.clickValue, function (res) {
                    $scope.data = res;
                    $scope.data.inputdate = utils.parseTime(new Date($scope.data.inputdate), "YYYY-MM-DD");
                    // angular.element('.nicEdit-main')[0].innerHTML = $scope.data.details;
                })

            };

            //方法
            var define_function = function () {

                $scope.goState = function () {

                    var sRouter = "";
                    if (postData.type == "home") {

                        sRouter = "main.home";
                        $rootScope.$emit("menustateChange", { value: sRouter, HeadNew: true });
                        $state.go(sRouter);

                    } else {

                        sRouter = "main.notice";
                        $rootScope.$emit("menustateChange", { value: null, HeadNew: false });
                        var itemDeal = {};
                        itemDeal.clickValue = postData.clickValue;
                        var data = JSON.stringify(itemDeal);

                        $state.go(sRouter, { "data": data });
                    }


                }

            };

            // 实际运行……
            define_variable();

            initialize();

            define_function();


        }]);
});