define(['bootstrap/app', 'utils', 'services/usercenter-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('suggestionFeedBack-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', '$uibModalInstance', 'values', 'usercenter-service','$cookies',
        function ($rootScope, $scope, $state, toaster, $uibModal, $modalInstance, values, usercenterService,$cookies) {

            var user = sessionStorage.getItem('loginUser');

            if (user) {
                user = JSON.parse(user);
            }

            //变量
            var define_variable = function () {
                $scope.data = {};

            };

            //加载
            var initialize = function () {
 
                if (values.suggData) {
                    //初始化
                    $scope.data = angular.copy(values.suggData); 
                    $scope.data.inputdate = utils.parseTime(new Date($scope.data.inputdate), "YYYY-MM-DD hh:mm:ss");
                    $scope.data.modifyuserid = user.id;

                    usercenterService.getFeedBackList($scope.data.id,function (res) {
                        $scope.data.feedBackLists = res;
                    });

                } 

            };

            //方法
            var define_function = function () {


                $scope.ok = function () {
                    if (!$scope.feedbackdetails) {
                        toaster.pop({ type: 'danger', body: '请填写反馈意见！' });
                        return;

                    }
                    var data={
                        id:"",
                        sid: $scope.data.id,
                        fdetails:$scope.feedbackdetails,
                        feedbackid:user.id
                    }
                    usercenterService.SaveSuggestionFeedBack(data, function (params) {
                        if (params == 200) {
                            toaster.pop({ type: 'success', body:  '反馈成功！' });
                            $modalInstance.close(params);

                        } else {
                            toaster.pop({ type: 'danger', body: '反馈失败！' });
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