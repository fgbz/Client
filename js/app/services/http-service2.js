define(['bootstrap/app', 'utilities/cryto'], function (app) {
    'use strict';

    var cryto = require('utilities/cryto');

    app.service('http-service2', ['$http', '$cookies', 'baseUrl', '$cacheFactory', '$q', function ($http, $cookies, baseUrl, $cacheFactory, $q) {

        var COOKIE_SESSION = 'PUMPKIN_SESSION';

        var headers = {
            'Content-Type': 'application/json; charset=UTF-8'
        };

        var session = $cookies.get(COOKIE_SESSION);

        if (session != undefined) {

            var sessionObject = JSON.parse(cryto.decrypt(session));
            // console.log(sessionObject);

            headers['SESSION_ID'] = sessionObject.SessionId;
        }

        this.updateSessionId = function (access_token) {

            headers['SESSION_ID'] = access_token;
        };

        this.get = function (url, requestConfig) {
            var vhttpConfig = { url: baseUrl + url, headers: headers, method: 'GET' };
            if (requestConfig) {
                angular.extend(vhttpConfig, requestConfig);
            }

            //前置条件 1、未开启缓存的服务  
            //前置条件 2、开启响应最后一次请求
            if (!vhttpConfig.cache && vhttpConfig.isResponseLast) {

                var vRequestCache = null;
                if (!$cacheFactory.get('requestCache')) {
                    vRequestCache = $cacheFactory("requestCache");
                } else {
                    vRequestCache = $cacheFactory.get('requestCache');
                };

                var tick = (new Date()).getTime() + '';
                var draw = parseInt(tick.substring(tick.length - 8));
                if (vhttpConfig.url.indexOf('?') > 0) {
                    vhttpConfig.url = vhttpConfig.url + "&draw=" + draw;
                } else {
                    vhttpConfig.url = vhttpConfig.url + "?draw=" + draw;
                }
                var keyUrl = url.substring(0, url.indexOf('?') > 0 ? url.indexOf('?') : url.length);
                vRequestCache.put(baseUrl+keyUrl, draw);
                console.log(draw);
            }
            var deferred = $q.defer();

            var promise = deferred.promise;

            promise.success = function (fn) {
                promise.then(function (response) {
                    if (response && response.RequestId) {
                        console.log(response);}
                    fn(response);
                });
                return promise;
            };

            promise.error = function (fn) {
                promise.then(null, function (response) {
                    fn(response);
                });
                return promise;
            }

            $http(vhttpConfig)
            .success(function (d) {
                if (d) {
                    var keyUrl = url.substring(0, url.indexOf('?') > 0 ? url.indexOf('?') : url.length);
                    if (d.RequestId) {
                        if (vRequestCache.get(baseUrl + keyUrl) == d.RequestId) {
                            deferred.resolve(d);
                        } else {
                            deferred.reject("not then same RequestId");
                        }
                    } else {
                        deferred.resolve(d);
                    }
                } else {
                    deferred.resolve(d);
                }

            }).error(function (msg) {
                deferred.reject(msg);
            });
            return deferred.promise;
        };

        this.post = function (url, data) {

            return $http({ url: baseUrl + url, headers: headers, method: 'POST', params: undefined, data: data });
        };

        this.put = function (url, data) {

            return $http({ url: baseUrl + url, headers: headers, method: 'PUT', params: undefined, data: data });
        };

        this.del = function (url, data) {

            return $http({ url: baseUrl + url, headers: headers, method: 'DELETE', params: undefined, data: data });
        };

        // POST stream 数据到服务器的时候，不指定 Content-Type，但是之后需要通过 Header 传递 Token
        // 所以需要一个单独的方法。
        this.post_raw = function (url, data) {
            var vRequestCache = null;
            if (!$cacheFactory.get('requestCache')) {
                vRequestCache = $cacheFactory("requestCache");
            } else {
                vRequestCache = $cacheFactory.get('requestCache');
            };
            
            var tick =(new Date()).getTime()+'';
            var draw = parseInt(tick.substring(tick.length - 8));
            if (data) {
                 data=  data.replace("&&","\\*\\&");//如果输入的是& ，则转义成\*\，服务端再换成&
                data=  data.replace("%26","\\*\\&");//如果输入的是&,会通过转码转成%26 ，则转义成\*\，服务端再换成&
                var aData = data.split('&');
                for(var key in aData) {
                    if (aData[key].indexOf('draw') > -1) {
                        aData[key] = 'draw=' + draw;
                        break;
                    } else {
                        //找到最后没找到 
                        if (key == aData.length - 1)
                        {
                            aData.push('draw=' + draw);
                        }
                    }
                }
                data = aData.join('&');
            } else {
                data = 'draw=' + draw;
            }
            vRequestCache.put(baseUrl+url, draw);
            //console.log(draw);
            var deferred = $q.defer();

            var promise = deferred.promise;

            promise.success = function(fn) {
                promise.then(function (response) {
                   // console.log(response);
                    fn(response);
                });
                return promise;
            };

            promise.error = function (fn) {
                promise.then(null, function (response) {
                    fn(response);
                });
                return promise;
            }


            $http({ url: baseUrl + url, headers: { 'Content-Type': '', 'SESSION_ID': headers.SESSION_ID }, method: 'POST', params: undefined, data: data })
                            .success(function (d) {
                                if (d) {
                                    if (d.draw == vRequestCache.get(baseUrl + url)) {
                                        deferred.resolve(d);
                                    } else {
                                        deferred.reject("not then same draw");
                                    }
                                } else {
                                    deferred.resolve(d);
                                }

                            }).error(function (msg) {
                                deferred.reject(msg);
                            });
            return deferred.promise;

        };

    }]);
});