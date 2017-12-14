define(['bootstrap/app', 'app/config-manager', 'services/http-service'], function (app) {
    'use strict';

	var cryto = require('utilities/cryto');

    app.service('staff-manager-service', ['http-service','defaultPassword', function (http,defaultPassword) {

        // 员工列表 展示员工信息的方法。
        // this.queryStaffByDepartmentId = function (draw, start, length, department_id) {

        //     return http.post_raw('StaffManager/jQueryDataTablesStaffsByDepartment', "draw=" + draw + "&start=" + start + "&length=" + length + "&id=" + department_id);
        // };

		this.initTableById = function (options) {
			var url = (options.type == 1 ? 'Staff/StaffOfOrganization' : 'Staff/GetStaffOfDepartment');
			var data = options;//'DepartmentId=' + options.id + '&RequestId=1&Start=' + options.start + '&Length=' + options.length + '&strSearch=' + (options.strSeach ? options.strSeach : '');
			data.RequestId = 1;
			if(options.type == 1){
				data.OrganizationId = options.id;
			}
			else{
				data.DepartmentId = options.id;
			}
            var errorCallBacks = function () {
				// alert('failed')
			};
			return http.post(url, data);
		};

		// this.queryStaffByDepartmentId = function (draw, start, length, department_id) {

        //     return http.post('Staff/GetStaffOfDepartment', "RequestId=" + new Date().getTime() + "&Start=" + start + "&Length=" + length + "&DepartmentId=" + department_id);
        // };

        // 查看 单个员工的方法
        this.getStaff = function (staff_id) {

            return http.get('StaffManager/Staff?id=' + staff_id);
        };

		this.insertOrUpdateStaff = function (userModel) {
			var url = ('Id' in userModel ? 'Staff/Staff' : 'Staff/Staff');
			var data = userModel;
			//Password:cryto.getSHA256(defaultPassword)
			//新增用户的密码应该与用户名一致 这里不管新增还是编辑，统一赋值，服务端会重新处理
			angular.extend(data,{Password:cryto.getSHA256(userModel.Account)});
			
			return 'Id' in userModel ? http.post(url, data) : http.put(url, data);
		};

		this.deleteStaff = function (data) {
			var url = 'Staff/Staff';
			// var data = [];
			// data.push(userId);
			// alert(JSON.stringify(data))
			return http.del(url, data);
		};
		
		this.getStaffById = function (userId) {
		    var url = 'Staff/GetStaff?id=' + userId + '&t=' + new Date().getTime();
			// alert(JSON.stringify(data))
			return http.get(url);
		};
		
		this.getCurrentUser=function(){
			var url = 'Staff/CurrentStaff';
			
			return http.get(url);
		};
		
		this.updatePassword = function(data){
			var url= 'Auth/UpdatePassword';
			
			return http.post(url, data);
		};
		
		this.GetAuthorizedInformation=function(){
			var url= 'Auth/GetAuthorizedInformation';
			
			return http.get(url);
		};

    }]);
});