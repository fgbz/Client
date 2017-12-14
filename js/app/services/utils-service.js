define(['modules/index-module', 'services/http-service'], function (app) {
	'use strict';
	
    var config = require('app/config-server');
    
    var rootPath = config.getRoot();
    
	app.factory('utils-service', ['$http', '$modal', function ($http, $modal) {
        var methods = {
            confirm: function (text,size) {
                return $modal.open({
                    templateUrl: rootPath + 'partials/_confirmModal.html',
                    backdrop: "static",
                    size:size,
                    controller: "confirmmModal",
                    resolve: {
                        items: function () {
                            return text;
                        }
                    }
                });
            },
            notify: function (content, type) {
                $.notify(content, { type: type, delay: 1000, z_index: 1000000, placement: { from: 'top', align: 'right' } });
             }//,
            // remove: function (list, item, fn) {
            //     angular.forEach(list, function (i, v) {
            //         if (fn ? (fn(i, item)) : (i.$$hashKey === item.$$hashKey)) {
            //             list.splice(v, 1);
            //             return false;
            //         }
            //         return true;
            //     });
            // }
        }
        return methods;
    }]);
	
	app.controller('confirmmModal', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
        var methods = {
            ok: function () {
                $modalInstance.close(true);
            },
            cancel: function () {
                $modalInstance.dismiss('cancel');
            },
            text: items
        };
        angular.extend($scope, methods);
    }]);
});