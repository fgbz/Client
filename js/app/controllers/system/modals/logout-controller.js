define(['bootstrap/app'], function (app) {
    'use strict';

    app.controller('logout-controller', ['$scope', '$uibModalInstance', 'values', function ($scope, $uibModalInstance, values) {

        $scope.ok = function () {
            $uibModalInstance.close(true);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);
});