(function () {
  var _protocol = 'http';
  var _server = '127.0.0.1'; //192.168.56.101'127.0.0.1'; 

  var _port = '8080';

  // 地图相关配置
  var _mapConfig = {};

  // console.info(_server);
  // 获取服务端的基础访问地址，各个 service 会需要用到。
  // 例如：http://127.0.0.1:8000/
  var baseUrl = function () {
    return _protocol + '://' + _server + ':' + _port+'/Phalaenopsis';
  };

  var mapConfig = function () {
    return _mapConfig;
  };

  var webReaderUrl=function(){
    return "http://127.0.0.1:8086/web-reader/reader?file=";
  }

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return {
        baseUrl: baseUrl,
        mapConfig: mapConfig,
        webReaderUrl:webReaderUrl
      };
    });
  }
})();
