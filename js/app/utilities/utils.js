define(function () {

    'use strict';

    var $ = function () {
        return new $.fn.init();
    };

    $.fn = $.prototype;

    $.fn.init = function () {
        return this;
    };

    $.fn.init.prototype = $.fn;

    $.extend = $.fn.extend = function (destination, source) {
        //if source is not exist，copy the destination to this。
        if (typeof source === 'undefined') {
            source = destination;
            destination = this;
        }
        for (var property in source) {
            if (source.hasOwnProperty(property)) {
                destination[property] = source[property];
            }
        }
        return destination;
    };

    // is
    $.extend({
        isUndefined: function (obj) {
            return obj === void 0;
        },
        isNull: function (obj) {
            return obj === null;
        },
        isBoolean: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Boolean]';
        },
        isNumber: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Number]';
        },
        isString: function (obj) {
            return Object.prototype.toString.call(obj) === '[object String]';
        },
        isNaN: function (obj) {
            return obj !== obj;
        },
        isFunction: function (obj) {
            return typeof obj === 'function';
        },
        isDate: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Date]';
        },
        isArray: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        isObject: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Object]';
        },
        has: function (obj, key) {
            return Object.prototype.hasOwnProperty.call(obj, key);
        },
        //To judge whether the array, string, obj is empty
        isEmpty: function (obj) {
            if (obj == null) return true;
            if ($.isArray(obj) || $.isString(obj)) return obj.length === 0;
            for (var key in obj) if ($.has(obj, key)) return false;
            return true;
        }
    });

    $.extend({
        //$.parseTime(new Date(), 'YYYY-MM-DD hh:mm:ss')
        //result: "2016-08-03 16:14:12"
        parseTime: function (date, format) {
            var o = {
                'M+': date.getMonth() + 1, //month 
                'D+': date.getDate(), //day 
                'h+': date.getHours(), //hour 
                'm+': date.getMinutes(), //minute 
                's+': date.getSeconds(), //second 
                'S': date.getMilliseconds() //millisecond 
            }

            if (/(Y+)/.test(format)) {
                format = format.replace(RegExp.$1,
                    (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            }

            for (var k in o) {
                if (new RegExp('(' + k + ')').test(format)) {
                    format = format.replace(RegExp.$1,
                        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
                }
            }
            return format;
        },

        //$.parseUrl(location.href)
        //return an object contains the folling info.
        parseUrl: function (url) {
            var a = document.createElement('a');
            a.href = url;
            return {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function () {
                    var ret = {},
                        seg = a.search.replace(/^\?/, '').split('&'),
                        len = seg.length, i = 0, s;
                    for (; i < len; i++) {
                        if (!seg[i]) { continue; }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^\/])/, '/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            };
        },

        //$.toFixedFloat(15.658, 2)
        //result: 15.66
        toFixedFloat: function (value, precision) {
            var power = Math.pow(10, precision || 0);
            return String(Math.round(value * power) / power);
        },

        //for generate random string
        //$.generateRandomAlphaNum(5)
        //random result: like "rc3sr".
        generateRandomAlphaNum: function (len) {
            var rdmString = '';
            for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
            return rdmString.substr(0, len);
        }
    });

    // utility
    $.extend({
        // 判断数组中是否包含元素
        contains: function (array, element) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === element)
                    return true;
            }
            return false;
        },

        // Trim
        trim: function (str, c) {
            if (c == null || c == '')
                c = '\\s';
            var reg = new RegExp('(^' + c + '*)|(' + c + '*$)', 'g');
            return str.replace(reg, '');
        },

        // TrimStart
        trimStart: function (str, c) {
            if (c == null || c == '')
                c = '\\s';
            var reg = new RegExp('(^' + c + '*)', 'g');
            return str.replace(reg, '');
        },

        // TrimEnd
        trimEnd: function (str, c) {
            if (c == null || c == '')
                c = '\\s';
            var reg = new RegExp('(' + c + '*$)', 'g');
            return str.replace(reg, '');
        },

        // 根据列表项的属性值获取列表中的项
        getListItem: function (val, prop, list) {
            if (!list)
                return null
            for (var i in list) {
                if (prop) {
                    if (list[i][prop] == val)
                        return list[i];
                } else {
                    if (list[i] == val)
                        return list[i];
                }
            }
            return null;
        },

        // 根据列表项的属性值获取列表中所有符合条件的项
        getListItems: function (val, prop, list) {
            var result = [];
            if (!list)
                return result;
            for (var i in list) {
                if (prop) {
                    if (list[i][prop] == val)
                        result.push(list[i]);
                } else {
                    if (list[i] == val)
                        result.push(list[i]);
                }
            }
            return result;
        },

        // 将字符串转换为数字
        toFloat: function (val) {
            var result = 0;
            if (val && !isNaN(val))
                result = parseFloat(val);
            return result;
        }
    });

    // datetimeParser
    var dateformat = {
        CN: {
            WDAY: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            wDAY: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            MonthName: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            AM: '上午',
            PM: '下午'
        },
        EN: {
            WDAY: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            wDAY: ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'],
            MonthName: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            monthName: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            AM: 'AM',
            PM: 'PM',
            am: 'am',
            pm: 'pm'
        }
    }
    $.extend({
        //将js Date对象转换为WCF反序列化时间类型所需要的字符串格式
        convertDateToJSONDate: function (date) {
            if (date instanceof Date)
                return "/Date(" + date.getTime() + "+0800)/";
            return null;
        },
        //将WCF序列化的时间格式字符串转换为js Date对象
        convertJSONDateToDate: function (dateString) {
            //WCF序列化的时间字符串格式为：\/Date(1453176000000+0800)\/
            if (typeof dateString === "string") {
                try {
                    var match = /\/(Date\(\d+\+\d+\))\//.exec(dateString);
                    //match[1]：Date(1453176000000+0800)
                    match[1] = match[1].replace(/(\+\d+)/, "");
                    var date = eval('new ' + match[1]);
                    return date;
                } catch (e) {
                    return null;
                }
            }
            return null;
        },
        // Date格式化为字符串——d：时间，mask：转换格式
        format: function (d, mask) {
            if (typeof d == "string")
                d = this.convertJSONDateToDate(d);
            if (!(d instanceof Date))
                return d;
            var zeroize = function (value, length) {
                if (!length) length = 2;
                value = String(value);
                for (var i = 0, zeros = ''; i < (length - value.length); i++) {
                    zeros += '0';
                }
                return zeros + value;
            };
            var formatCode = {
                'dddd': dateformat.CN.WDAY[d.getDay()],
                'ddd': dateformat.CN.wDAY[d.getDay()],
                'dd': zeroize(d.getDate()),
                'd': d.getDate(),
                'MMMM': dateformat.CN.MonthName[d.getMonth()],
                'MMM': dateformat.EN.monthName[d.getMonth()],
                'MM': zeroize(d.getMonth() + 1),
                'M': d.getMonth() + 1,
                'yyyy': d.getFullYear(),
                'yy': String(d.getFullYear()).substr(2),
                'hh': zeroize(d.getHours() % 12 || 12),
                'h': d.getHours() % 12 || 12,
                'HH': zeroize(d.getHours()),
                'H': d.getHours(),
                'mm': zeroize(d.getMinutes()),
                'm': d.getMinutes(),
                'ss': zeroize(d.getSeconds()),
                's': d.getSeconds(),
                'l': zeroize(d.getMilliseconds(), 3),
                'L': function () {
                    var m = d.getMilliseconds();
                    if (m > 99) m = Math.round(m / 10);
                    return zeroize(m);
                }(),
                'TT': d.getHours() < 12 ? dateformat.CN.AM : dateformat.CN.PM,
                'T': d.getHours() < 12 ? dateformat.EN.AM : dateformat.EN.PM,
                't': d.getHours() < 12 ? dateformat.EN.am : dateformat.EN.pm,
                'Z': d.toUTCString().match(/[A-Z]+$/),
            };

            for (var i in formatCode) {
                mask = mask.replace(i, formatCode[i]);
            }
            return mask;
        },
        // 当前日期（DateTime格式）
        get jsonDateNow() {
            var date = new Date();
            var cDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return this.convertDateToJSONDate(cDate);
        }
    });

    // 文件大小单位
    var sizeUnit = ['B', 'KB', 'MB', 'GB', 'TB'];
    $.extend({
        // 单位换算
        unitCalc: function (size, precision) {
            if (!$.isNumber(size)) return;
            var index = 0;
            var standard = 1024 * 0.1;
            while (size >= standard) {
                size /= 1024;
                index++;
            }
            if ($.isNumber(precision))
                size = $.toFixedFloat(size, precision);
            return size + sizeUnit[index];
        },
        // 标记文本颜色
        markStyleColor: { Green: 'green', Red: 'red', Blue: 'blue' },
        markStyle: function (word, color) {
            color = color || 'blue';
            return '<span style="color:' + color + '">' + word + '</span>';
        },
        // 拼接数组
        spliceArray: function (array) {
            var result = [];
            for (var i in array) {
                result.push.apply(result, array[i]);
            }
            return result;
        },
        // 获取文件后缀名
        getExtension: function (name) {
            var index = name.lastIndexOf('.');
            var ext = '';
            if (index > -1)
                ext = name.substring(index + 1).toLowerCase();
            return ext;
        },
        // 获取文件名
        getFileName: function (name) {
            var index = name.lastIndexOf('.');
            return index > -1 ? name.substring(0, index) : name;
        }
    });

    $.extend({
        // same as string.IsNullOrEmpty
        isNullOrEmpty: function (value) {
            return $.isUndefined(value) || $.isNull(value) || value.length == 0;
        },
        // 拼接url params
        encodeURIComponent: function (obj) {
            var queryStr = "";
            for (var d in obj) {
                if (queryStr.length == 0) {
                    queryStr += "?";
                }
                else {
                    queryStr += "&";
                }
                queryStr += d + "=" + encodeURIComponent(obj[d]);
            }
            return queryStr;
        }
    })

    return $;
});