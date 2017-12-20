define(['bootstrap/app', 'utilities/cryto', 'app/config-manager'], function (app) {
    'use strict';

    var cryto = require('utilities/cryto');
    var config = require('app/config-manager');

    app.service('http-service', ['$http', '$cookies', 'baseUrl', '$cacheFactory', '$q', '$window', function ($http, $cookies, baseUrl, $cacheFactory, $q, $window) {

        //   var authID = $cookies.get('AUTH_ID');
        var authID = '1';
        var hostAddress = baseUrl;

        var headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            'AUTH_ID': '1'
        };

        function onError(ex, statusCode) {
            if (statusCode == 403) {
                //超时
                $cookies.remove('AUTH_ID');
                alert('操作超时，请重新登录！');
                $window.location.replace('/page/login.html');
            }
            else if (statusCode == 500) {
                //请求出错
                alert('请求出现错误！');
            }
        }

        function fn(callback) {
            return typeof callback === "function" ? callback : angular.noop;
        }

        var http = {
            $http: function () {
                return $http;
            },

			/**
			 * 发送get请求，用于查询、获取数据
			 * queryParams：附加到url中查询字符串参数的json对象
			 * callback：请求成功时的回调方法
			 */
            get: function (url, queryParams, callback) {
                if (!!window.ActiveXObject || "ActiveXObject" in window) { // isIE
                    if (url.indexOf('?') >= 0) {
                        url += '&' + Math.random();
                    }
                    else {
                        url += '?' + Math.random()
                    }
                }
                $http.get(hostAddress + url, {
                    params: queryParams,
                    headers: headers
                }).success(fn(callback)).error(onError);
            },
            /**
         * 发送get请求，用于查询、获取数据
         * queryParams：附加到url中查询字符串参数的json对象
         * callback：请求成功时的回调方法
         */
            getContainError: function (url, queryParams, callback, errorcallback) {
                if (!!window.ActiveXObject || "ActiveXObject" in window) { // isIE
                    if (url.indexOf('?') >= 0) {
                        url += '&' + Math.random();
                    }
                    else {
                        url += '?' + Math.random()
                    }
                }
                $http.get(hostAddress + url, {
                    params: queryParams,
                    headers: headers
                }).success(fn(callback)).error(errorcallback);
            },
			/**
			 * 发送post请求，用于新增数据
			 * data：提交到服务端的数据的json对象
			 * queryParams：可选
			 */
            post: function (url, data, callback, queryParams) {
                $http.post(hostAddress + url, data, {
                    params: typeof queryParams === "undefined" ? null : queryParams,
                    headers: headers
                }).success(fn(callback)).error(onError);
            },
            /**
             * 发送post请求，用于新增数据
             * data：提交到服务端的数据的json对象
             * queryParams：可选
             */
            postContainError: function (url, data, callback, errorcallback, queryParams) {
                $http.post(hostAddress + url, data, {
                    params: typeof queryParams === "undefined" ? null : queryParams,
                    headers: headers
                }).success(fn(callback)).error(errorcallback);
            },
			/**
			 * 发送put请求，用于修改数据
			 * queryParams：可选
			 */
            put: function (url, data, callback, queryParams) {
                $http.put(hostAddress + url, data, {
                    params: typeof queryParams === "undefined" ? null : queryParams,
                    headers: headers
                }).success(fn(callback)).error(onError);
            },
			/**
			 * 发送delete请求，用于删除数据
			 */
            delete: function (url, queryParams, callback) {
                $http.delete(hostAddress + url, {
                    params: queryParams,
                    headers: headers
                }).success(fn(callback)).error(onError);
            },
            /**
             * 在url中包装身份票据
             */
            wrapUrl: function (url) {
                var p = 'AUTH_ID=' + encodeURIComponent(authID);
                if (url.indexOf('?') >= 0) {
                    url += '&' + p;
                }
                else {
                    url += '?' + p;
                }
                return url;
            },
            /**
            * 在url中包装身份票据
            */
            wrapPDFUrl: function (url) {
                var p = 'AUTH_ID=' + encodeURIComponent(authID);
                url += ';' + p;
                return url;
            },
            /**
             * 包装请求头
             */
            wrapHeader: function (header) {
                return angular.extend(header || {}, { headers: { 'AUTH_ID': authID } });
            }
        };
        return http;

    }]);
});