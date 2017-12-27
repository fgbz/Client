define(['bootstrap/app', 'app/config-manager', 'services/http-service', 'utilities/cryto', 'angular-file-upload'], function (app) {
    'use strict';

    var config = require('app/config-manager');

    var baseUrl = config.baseUrl();

    var cryto = require('utilities/cryto');

    app.service('accessory-service', ['http-service', '$cookies', 'FileUploader', function (http, $cookies, FileUploader) {


		//获取附件信息
		this.getAccessoryByDirId = function (id,callback) {
			var url = '/Foundation/Attachment/GetAttachments?bizID='+ id;
            return http.get(url,null,callback);
		};


		//删除
		this.removeAccessory = function (data,callback) {
			var url = '/Foundation/Attachment/Delete';
			return http.post(url,data,callback);
		};

		//下载
		this.downloadAccessory = function (fileId,modulename) {
			var url = baseUrl + '/Foundation/Attachment/Download?file=' + fileId+"&module="+modulename;
			location.href =  http.wrapUrl(url);
		};

		//预览
		this.getPreView = function (fileId,callback) {
			var url = '/Foundation/Attachment/getPreView?file='+fileId;
			return http.get(url,null,callback);
		}


    

    }]);
});