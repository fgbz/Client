define(['bootstrap/app', 'utilities/cryto'], function (app) {
    'use strict';

    var cryto = require('utilities/cryto');

    app.controller('error-controller', ['$rootScope', '$scope', '$state', '$cookies', 'authorization-service', function ($rootScope, $scope, $state, $cookies, auth_service) {

        var COOKIE_SESSION = 'PUMPKIN_SESSION';

        $scope.errorMessage = "错误详细内容……";

        $scope.return = function () {

            $cookies.remove(COOKIE_SESSION);
            $state.go('login');
        };

        var session = $cookies.get(COOKIE_SESSION);

        if (session != undefined) {

            var sessionObject = JSON.parse(cryto.decrypt(session));

            if(sessionObject.IsAuthorized){
                $state.go('main.home');
            } else {
                $state.go('login');
            }
            
            // auth_service.IsAuthorized().success(function (result) {

            //     if (result != undefined && result.Code == 1) {
            //         $state.go('main.home');
            //     } else {
            //         $state.go('login');
            //     }

            // }).error(function () {
            //     $scope.errorMessage = "授权验证出错。";
            // });

        }

        
    }]);
});