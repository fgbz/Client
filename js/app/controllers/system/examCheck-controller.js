define(['bootstrap/app', 'utils', 'services/accessory-service', 'services/region-service', 'services/organization-manager-service', 'app/config-manager', 'services/enum-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('examCheck-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', '$uibModalInstance',
        function ($rootScope, $scope, $state, toaster, $uibModal, $modalInstance) {



            //变量
            var define_variable = function () {


            };

            //加载
            var initialize = function () {



                $scope.items = [
                    { ExamName: '万小虎', ExamTime: '2017-10-26', ExamRemark: "替代关系不明确" },
                    { ExamName: '万小虎', ExamTime: '2017-10-10', ExamRemark: "无附件" },
                    { ExamName: '万小虎', ExamTime: '2017-10-01', ExamRemark: "信息不正确" }
                ];


            };

            //方法
            var define_function = function () {
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