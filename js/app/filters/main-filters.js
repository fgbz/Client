define(['angular', 'utils'], function (ng, utils) {
    'use strict';

    var fm = ng.module('main-filters', []);

    fm.filter('gender', [function () {
        return function (gender) {

            var res = undefined;

            switch (gender) {
                case 1:
                    res = '男';
                    break;
                case 2:
                    res = '女';
                    break;
                case 0:
                    res = '不确定';
                    break;
                default:
                    res = gender;
                    break;
            };

            return res;
        };
    }]);
    fm.filter('isTrue', [function () {
        return function (data) {

            var res = undefined;

            if (data) {
                res = '是'
            } else {
                res = '否'
            }

            return res;
        };
    }]);

    fm.filter('trustAsHtml', ['$sce', function ($sce) {
        return function (content) {
            return $sce.trustAsHtml(content);
        };
    }]);

    fm.filter('delHtmlTag', [function () {
        return function (content) {
            return content ? content.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, "") : '';
            // return content?content.replace(/<\/?.+?>/g,"").replace(/&nbsp;/g,""):'';
        };
    }]);

    fm.filter('timestamp_format', [function () {
        return function (time) {
            if (typeof (time) == 'number') {
                var date = new Date(parseInt(time)).toISOString();
                var newDate = date.split('T')[0].replace('-', '年').replace('-', '月') + '日';
                return newDate;
            } else {
                return '';
            }
        }
    }]);
    fm.filter('timestamp_format1', [function () {
        return function (time) {
            if (typeof (time) == 'number') {
                var date = new Date(parseInt(time)).toISOString();
                var newDate = date.split('T')[0].replace('-', '年').replace('-', '月');
                return newDate;
            } else {
                return '';
            }
        }
    }]);

    fm.filter('roleName', [function () {
        return function (roles) {
            //  alert(JSON.stringify(roles,0,4))
            var str = "";
            for (var i = 0; i < roles.length; i++) {
                str += roles[i].value + ";";
            }
            if (str.length > 8) {
                str = str.substring(0, 8) + "...";
            }
            return str;
        }
    }])
    fm.filter('roleNameDetail', [function () {
        return function (roles) {
            var str = "";
            for (var i = 0; i < roles.length; i++) {
                str += roles[i].value + ";";
            }
            return str;
        }
    }]);

    fm.filter('accountName', [function () {
        return function (account) {
            //  alert(JSON.stringify(posts,0,4))
            var str = "";
            if (account != null) {
                if (account.length > 7) {
                    str = account.substring(0, 7) + "...";
                } else {
                    str = account;
                }
            }
            return str;
        }
    }]);

    fm.filter('Name', [function () {
        return function (account) {
            //  alert(JSON.stringify(posts,0,4))
            var str = "";
            if (account.length > 6) {
                str = account.substring(0, 6) + "...";
            } else {
                str = account;
            }
            return str;
        }
    }]);
    //返回年月日 如2017-05-12
    fm.filter('recordtime', [function () {
        return function (time) {
            //return time;
            if (time && typeof (time) == 'number') {
                // var date = new Date(parseInt(time)).toISOString();
                // var newDate = date.split('T')[0];
                var newDate = utils.parseTime(new Date(time), "YYYY-MM-DD")
                return newDate;
            } else if (time == null || time == 0) {
                return "-"
            } else {
                return time;
            }
        }
    }]);
    //返回年月 如2017年05月
    fm.filter('recordDate', [function () {
        return function (time) {
            if (time && typeof (time) == 'number') {
                var date = new Date(parseInt(time)).toISOString();
                var newDate = date.split('T')[0];
                var dateStr = newDate.split('-');
                var result = dateStr[0] + "年" + dateStr[1] + "月";
                return result;
            } else if (time == null || time == 0) {
                return "-"
            } else {
                return time;
            }
        }
    }]);

    fm.filter('orgname', [function () {
        return function (orgname) {
            //  alert(JSON.stringify(posts,0,4))
            var str = "";
            if (orgname) {
                if (orgname.length > 4) {
                    str = orgname.substring(0, 3) + "...";
                } else {
                    str = orgname;
                }
            }
            return str;
        }

    }]);

    //限制输入字数
    fm.filter('tooltips', [function () {
        return function (strName, len) {
            if (strName != null) {
                if (strName.length > len) {
                    return strName.substring(0, len) + '...';
                }
                else {
                    return strName;
                }
            }
            else {
                return strName
            }

        }
    }]);
    fm.filter('selectFilter', [function () {

        return function (str, list) {
            var name = ''
            for (var i = 0; i < list.length; i++) {
                if (list[i].Code == str) {
                    name = list[i].Name
                    return name;
                }
            }
        }
    }]);
    //处理秒级时间戳 返回毫秒级时间戳 消除本地时间差
    fm.filter('getDate', [function () {

        return function (p) {
            var date = parseInt(p);
            var dt = parseInt(new Date().getTimezoneOffset() * 60);//得到时区差

            return (date - dt) * 1000;
        }
    }]);

    //根据年月日得到时间戳
    fm.filter('getTimestamp', [function () {

        return function (p) {
            var stringTime = p;
            var timestamp2 = Date.parse(new Date(stringTime));
            timestamp2 = timestamp2;

            return timestamp2;
        }
    }]);

    //字符太长显示...
    fm.filter('cut', [function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }
            return value + (tail || ' …');
        };
    }]);

    fm.filter('onlinecount', [function () {
        return function (arr) {
            var count = 0;
            if (arr) {
                angular.forEach(arr, function (value, key) {
                    if (value.Online) {
                        count += 1;
                    }
                })
            }
            return count;
        };
    }]);

    fm.filter('seportType', [function () {
        return function (seportType) {

            var res = undefined;

            switch (seportType) {
                case 1:
                    res = '月统计表';
                    break;
                case 2:
                    res = '违法查处情况表';
                    break;
                case 3:
                    res = '建成区违法查处情况表';
                    break;
                default:
                    res = '';
                    break;
            };

            return res;
        };
    }]);

    fm.filter('isReport', [function () {
        return function (isReport) {

            var res = undefined;

            switch (isReport) {
                case 1:
                    res = '已上报';
                    break;
                case 2:
                    res = '退回';
                    break;
                default:
                    res = '未上报';
                    break;
            };

            return res;
        };
    }]);

    fm.filter('fileFormat', function () {
        return function (fileName) {
            var format = '';
            var pos = fileName.lastIndexOf('.');
            if (pos > 0) {
                format = fileName.substring(pos + 1);
            } else {
                format = '未知';
            }
            return format;
        }
    });

    fm.filter('statisticalPercent', function () {
        return function (statisSum) {
            statisSum = statisSum * 100;
            return statisSum.toFixed(2) + "%"
        }
    });

    fm.filter('CountItems', function () {
        return function (sum, items, type) {
            sum = 0;
            angular.forEach(items, function (value, key) {
                sum += value[type];
            })
            return sum;
        }
    });

    fm.filter('accepttime', [function () {
        return function (time, type) {
            if (time && typeof (time) == 'number') {
                var date = "";
                var newDate = ""
                if (type) {
                    newDate = utils.parseTime(new Date(time), type);
                } else {
                    date = new Date(parseInt(time)).toISOString();
                    newDate = date.split('T')[0];
                }
                return newDate;
            } else {
                return '';
            }
        }
    }])

    fm.filter('changeTime', [function () {
        return function (time) {

            var date = utils.format(new Date(time), "yyyy-MM-dd HH:mm:ss");
            return date;

        }
    }])

    fm.filter('ReportType', [function () {
        return function (isReport) {

            var res = undefined;

            switch (isReport) {
                case 1:
                    res = '是';
                    break;
                default:
                    res = '否';
                    break;
            };

            return res;
        };
    }]);

    fm.filter('GSType', [function () {
        return function (isGS) {

            var res = undefined;

            switch (isGS) {
                case "0":
                    res = '是';
                    break;
                default:
                    res = '否';
                    break;
            };

            return res;
        };
    }]);

    fm.filter('approvestatus', [function () {
        return function (approvestatus) {

            var res = "";

            switch (approvestatus) {
                case 1:
                    res = '草稿';
                    break;
                case 2:
                    res = '已提交待审核';
                    break;
                case 3:
                    res = '发布';
                    break;
                default:
                    break;
            };

            return res;
        };
    }]);

    fm.filter("parseHTML", function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        }
    });
    //搜索高亮显示
    fm.filter("highlight", function ($sce) {
        var fn = function (text, search) {
            if (!search) {
                return $sce.trustAsHtml(text);
            }     
            var searchList = search.split(' ');
            var result = text;
            for (var i = 0; i < searchList.length; i++) {
                var regex = new RegExp(searchList[i], 'gi');
                if (result) {
                    result = result.replace(regex, '<span class="highlightedTextStyle">$&</span>');
                }

            }
            return $sce.trustAsHtml(result);
        };
        return fn;
    });

});