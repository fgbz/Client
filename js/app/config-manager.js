(function() {

    var _protocol = 'http';
    var _server = 'localhost'; //'127.0.0.1';
    var _port = '8080';

    // 地图相关配置
    var _mapConfig={  
    };
    
    // console.info(_server);
    // 获取服务端的基础访问地址，各个 service 会需要用到。
    // 例如：http://127.0.0.1:8000/
    var baseUrl = function() {
        return _protocol + '://' + _server + ':' + _port ;
    };

    var mapConfig=function(){
        return _mapConfig;
    }

    if (typeof define === 'function' && define.amd) {

        define(function() {
            return {
                baseUrl: baseUrl,
                mapConfig:mapConfig
            };
        });
    };
})();