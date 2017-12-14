define(['bootstrap/app', 'app/config-manager', 'services/http-service'], function (app) {
    'use strict';

    app.service('cache-service', ['http-service', '$cookies', function (http, $cookies) {
        //获取所有字典项
        this.GetAllDic = function () {
            return http.get('building/GetDicAll');
        };
        this.GetAllProvince = function() {
            return http.get('Region/GetAllProvince');
        };
        this.GetRegionByParent = function (Id) {
            return http.get('Region/GetRegionByParent?Id=' + Id);
        };
        var allDicObj = {};//全部字典项
        var allProvince = [];//所有一级行政区（温州市）
        var allDistrict = [];//所有温州市辖区
        var WZRegionId = '';
        this.getAllDic = function () {
            allDicObj = localStorage.getItem('allDicObj');
            allDicObj = JSON.parse(allDicObj);
            return allDicObj;
        };

        this.getAllProvince = function () {
            allProvince = localStorage.getItem('allProvince');
            allProvince = JSON.parse(allProvince).list;       
            return allProvince;
        };
        this.getAllDistrict = function () {
            allDistrict = localStorage.getItem('allDistrict');
            allDistrict = JSON.parse(allDistrict).list;
            return allDistrict;
        };
        this.getWZRegionId = function () {
            var a = localStorage.getItem('allProvince');
            a = JSON.parse(a).list;
            if(a){
                WZRegionId = a[0].Id;
            } 
            return WZRegionId;
        };

    }]);
});