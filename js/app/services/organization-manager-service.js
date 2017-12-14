define(['bootstrap/app', 'app/config-manager', 'services/http-service'], function (app) {
    'use strict';
    app.service('organization-manager-service', ['http-service', function (http) {

        this.getTree = function () {

            return http.get('Organization/Tree');
        };

		this.getTreeParent = function () {

            return http.get('Organization/Root');
        };

		this.getTreeChild = function (nodeId) {

            return http.get('Organization/SubNode?o=' + nodeId);
        };

		this.getTreeChildDep = function (nodeId) {

            return http.get('Organization/GetChildDepNode?depId=' + nodeId);
        };

		this.getTreeNode = function () {
			//var url = 'Organization/zTreeNodes';

			return http.get('Organization/zTreeNodes');
		};

		this.updateTreeNode = function (treeNode, treeDate) {
			var isP = false;
			if (treeNode.type == 2) {
				for (var i = 0; i < treeDate.length; i++) {
					if (treeDate[i].ObjectId == treeNode.parentId) {
						if (treeDate[i].type == 1) {
							isP = true;
						}
					}
				}
			}
			var url = (treeNode.type == 1 ? 'Organization/Organization' : 'Department/Department');
			var data = treeNode.type == 1 ? {
				"Id": treeNode.id,
				"Name": treeNode.title,
				"ParentId": treeNode.parentId,
				"RegionCode": treeNode.region_code,
				// "Description": treeNode.description,
                //"Rank": treeNode.orgLevel
			} : {
					"Id": treeNode.id,
					"Name": treeNode.title,
					"ParentId": isP ? '' : treeNode.parentId,
					// "Description": treeNode.description,
					"OrganizationId": treeNode.organizationId
				};

			var callback = function () {
				//console.log('组织机构信息修改成功！');
			};

			//alert(JSON.stringify(data,0,1));

			return http.post(url, data);
		};

		this.insertTreeNode = function (treeNode) {
			//alert(JSON.stringify(treeNode,0,1))
			var url = (treeNode.type == 1 ? 'Organization/Organization' : 'Department/Department');

			var data = treeNode.type == 1 ? {
				"Name": treeNode.title,
				"ParentId": treeNode.parentId,
				"RegionCode": treeNode.region_code,
				// "Description": treeNode.description,
                //"Rank": treeNode.orgLevel
			} : {
					"Name": treeNode.title,
					"ParentId": treeNode.parentId=='00000000-0000-0000-0000-000000000000'?'':treeNode.parentId,
					// "Description": treeNode.description,
					"OrganizationId": treeNode.organizationId
				};

			//  alert(JSON.stringify(data,0,1))
			//return;

			var callback = function (treeNode) {
				//console.log('添加组织机构成功！');
			}

			return http.put(url, data);
		};

		this.deleteTreeNode = function (treeNode) {
			var url = (treeNode.type == 1 ? 'Organization/Organization' : 'Department/Department');

			var callback = function (treeNode) {
				//console.log('删除组织机构成功！');
			}
			var data = [treeNode.id];

			return http.del(url, JSON.stringify(data));
		};

		this.getParentOrganizationId = function (scope) {
            var parentScope = scope.$parentNodeScope;
            var organizationId = '';
            if (scope.$modelValue.type == 1) {
                organizationId = scope.$modelValue.id;
				return organizationId;
            } else if (parentScope && parentScope.$modelValue.type == 1) {
				organizationId = parentScope.$modelValue.id;
				return organizationId;
            } else if (parentScope && parentScope.$modelValue.ype == 2) {
				return this.getParentOrganizationId(parentScope);
            };
        };

		this.GetDepartmentsByOrgId = function (Id) {
			var url = 'Organization/GetDepartmentsByOrgId?Id=' + Id;

			return http.get(url);
		}

		this.GetSubOrgByOrgId = function (Id) {
			var url = 'Organization/GetSubOrgByOrgId?Id=' + Id;

			return http.get(url);
		}

		this.GetOrgIdByRegionId = function (Id) {
			var url = 'Organization/GetOrgIdByRegionId?Id=' + Id;

			return http.get(url);
		}

		this.isNameExist = function (type, name, id) {
			var url = "";
			var data = {
				Id: id,
				Name: name
			}
			//1是组织，2是部门
			if (type == 1) {
				url = 'Organization/IsNameOrganizationExist';
			}
			else {
				url = 'Organization/IsNameDepartmentExist';
			}
			return http.post(url, data);
		}

		this.GetAllDepepartment = function () {

            return http.get('Organization/GetAllDepepartment');
        };
    }]);
});