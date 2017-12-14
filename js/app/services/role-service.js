define(['bootstrap/app', 'app/config-manager', 'services/http-service'], function (app) {
    'use strict';

    app.service('role-service', ['http-service', function (http) {

        this.GetRegionByParent = function (Id) {

            return http.get('Region/GetRegionByParent?Id=' + Id);
        };

        this.getRoles = function (id) {
            var url = "Role/GetRoleByOrganizationId?id={" + id + "}";
            var callback = function () {
                console.log('获取成功！');
            }
            return http.get(url);
        };

        this.GetAllRoles = function (id) {
            var url = "Role/Roles";

            return http.get(url);
        };

        this.initGetRoles = function (options) {
            var url = 'Role/Roles';

            var data = options;

            data.RequestId = 1;

            return http.post(url, data);
        };

        this.insertRole = function (RoleItem) {
            var url = 'Role/Role';

            return http.put(url, RoleItem);
        };

        this.deleteRole = function (RoleItem) {
            var url = 'Role/Role';

            return http.del(url, RoleItem);
        };

        this.updateRole = function (RoleItem) {
            var url = 'Role/Role';

            return http.post(url, RoleItem);
        };

        this.getFunctions = function () {
            var url = "Role/Functions";

            return http.get(url);
        };

    }]);
});