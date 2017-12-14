(function () {
    define(function () {
        'use strict';
        //私有方法 json 转请求参数
        var parseParam = function (param, key) {
            var paramStr = "";
            if (key) {
                paramStr += "&" + key + "=" + encodeURIComponent(param);
            } else {
                $.each(param, function (i) {
                    var k = key == null ? i : key + (param.length ? "[" + i + "]" : "." + i);
                    paramStr += '&' + parseParam(this, k);
                });
            }
            return paramStr.substr(1);
        };
        return { parseParam: parseParam };
    });
})();

