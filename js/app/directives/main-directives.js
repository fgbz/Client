define(['angular', 'nicEdit', 'jquery', 'utils'], function (ng, nicEditObj, jquery, utils) {
    'use strict';
    var md = ng.module('main-directives', []);

    var selectHelper = {
        /**获取选中文本的起始文字 */
        getSelectionStart: function (element) {
            var e = element[0];
            if (e.selectionStart != undefined) {
                return e.selectionStart;
            } else if (document.selection != undefined) {
                e.focus();
                var r = document.selection.createRange();
                var sr = r.duplicate();
                sr.moveToElementText(e);
                sr.setEndPoint('EndToEnd', r);
                return sr.text.length - r.text.length;
            }
            return 0;
        },
        /**获取选中文本的结束文字 */
        getSelectionEnd: function (element) {
            var e = element[0];
            if (e.selectionEnd != undefined) {
                return e.selectionEnd;
            } else if (document.selection != undefined) {
                e.focus();
                var r = document.selection.createRange();
                var sr = r.duplicate();
                sr.moveToElementText(e);
                sr.setEndPoint('EndToEnd', r);
                return sr.text.length;
            }
            return 0;
        },
        /**在鼠标光标位置插入字符串 */
        insertString: function (element, str) {
            $(element).each(function () {
                var tb = $(this);
                tb.focus();
                if (document.selection != undefined) {
                    var r = document.selection.createRange();
                    document.selection.empty();
                    r.text = str;
                    r.collapse();
                    r.select();
                } else {
                    var newstart = tb.get(0).selectionStart + str.length;
                    tb.val(tb.val().substr(0, tb.get(0).selectionStart) +
                        str + tb.val().substring(tb.get(0).selectionEnd));
                    tb.get(0).selectionStart = newstart;
                    tb.get(0).selectionEnd = newstart;
                }
            });
            return element;
        },
        /**选中文本 */
        setSelection: function (element, startIndex, len) {
            $(element).each(function () {
                if (this.setSelectionRange) {
                    this.setSelectionRange(startIndex, startIndex + len);
                } else if (document.selection != undefined) {
                    var range = this.createTextRange();
                    range.collapse(true);
                    range.moveStart('character', startIndex);
                    range.moveEnd('character', len);
                    range.select();
                } else {
                    this.selectionStart = startIndex;
                    this.selectionEnd = startIndex + len;
                }
            });
            return element;
        },
        /**获取选择的字符串 */
        getSelection: function (element) {
            var ele = element[0];
            var sel = '';
            if (ele.selectionStart != undefined && ele.selectionEnd != undefined) {
                var start = ele.selectionStart;
                var end = ele.selectionEnd;
                var content = $(ele).is(':input') ? $(ele).val() : $(ele).text();
                sel = content.substring(start, end);
            }
            else if (document.selection != undefined) {
                var r = document.selection.createRange();
                document.selection.clear();
                sel = r.text;
            }
            return sel;
        }
    };

    // main_menu.htm
    // 浏览器窗口调整时，使左边的菜单栏撑满整个浏览器高度。
    md.directive('resizeMenuHeight', function ($window) {

        return function (scope, element) {

            var w = ng.element($window);

            scope.getWindowDimensions = function () {
                return { 'w': $window.innerWidth, 'h': $window.innerHeight };
            };

            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {

                scope.windowHeight = newValue.h;

                scope.setMenuStyle = function () {
                    return {
                        'height': (newValue.h - 45) + 'px'
                    };
                };

            }, true);

            w.bind('resize', function () { scope.$apply(); });
        }
    });

    // main.htm
    // 浏览器窗口大小调整时，使右边的内容容器的尺寸默认撑满整个浏览器。
    md.directive('resizeIndexContent', function ($window) {

        return function (scope, element) {

            var w = ng.element($window);

            scope.getWindowDimensions = function () {
                return { 'w': $window.innerWidth, 'h': $window.innerHeight };
            };

            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {

                scope.windowWidth = newValue.w;
                scope.windowHeight = newValue.h;

                scope.setIndexContentStyle = function () {

                    return {
                        'height': (newValue.h - 160) + 'px'
                    };


                };

                scope.setIndexHeightStyle = function () {

                    return {
                        'height': (newValue.h - 160 - 80) + 'px',
                    };


                };

            }, true);

            w.bind('resize', function () { scope.$apply(); });
        };
    });

    md.directive('resizeDetailContent', function ($window) {

        return function (scope, element) {

            var w = ng.element($window);

            scope.getWindowDimensions = function () {
                return { 'w': $window.innerWidth, 'h': $window.innerHeight };
            };

            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {

                scope.windowWidth = newValue.w;
                scope.windowHeight = newValue.h;

                scope.setDetailContentStyle = function () {
                    return {
                        'height': (newValue.h - 120 - 25) + 'px',
                        'width': (newValue.w - 240) + 'px',
                        // 'overflow-y': 'scroll',
                        'display': 'inline-block',
                        'min-width': '980px',
                        'min-height': '433px',
                    };
                };
                scope.datasyncSetDetailContentStyle = function () {
                    return {
                        'height': (newValue.h - 120 - 78 - 11 + 50) + 'px',
                        'width': (newValue.w - 280) + 'px',
                        'overflow-y': 'scroll',
                        'display': 'inline-block',
                        'min-width': '980px',
                        'min-height': '433px',
                    };
                };

            }, true);

            w.bind('resize', function () { scope.$apply(); });
        };
    });

    md.directive('resizeDetailContentAll', function ($window) {

        return function (scope, element) {

            var w = ng.element($window);

            scope.getWindowDimensions = function () {
                return { 'w': $window.innerWidth, 'h': $window.innerHeight };
            };

            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {

                scope.windowWidth = newValue.w;
                scope.windowHeight = newValue.h;

                scope.setDetailContentStyleAll = function () {
                    return {
                        'height': (newValue.h - 120 - 18) + 'px',
                        'width': (newValue.w - 280) + 'px',
                        'overflow-y': 'scroll',
                        'display': 'inline-block',
                        'min-width': '980px'
                    };
                };

            }, true);

            w.bind('resize', function () { scope.$apply(); });
        };
    });

    md.directive('resizeHomeSteadHeight', function ($window) {

        return function (scope, element) {

            var w = ng.element($window);

            scope.getWindowDimensions = function () {
                return { 'w': $window.innerWidth, 'h': $window.innerHeight };
            };

            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {

                scope.windowWidth = newValue.w;
                scope.windowHeight = newValue.h;

                scope.setHomeSteadHeight = function () {
                    return {
                        'height': (newValue.h - 125) + 'px',
                        'overflow-y': 'auto',
                    };
                };
                scope.setHomeSelectHeight = function () {
                    return {
                        'height': (newValue.h - 280) + 'px',
                        'overflow-y': 'auto',
                    };
                };


            }, true);

            w.bind('resize', function () { scope.$apply(); });
        };
    });

    // 调整 人员/组织机构 树 的高度，占满屏幕高度。
    md.directive('resizeTreeHeight', function ($window) {

        return function (scope, element) {

            var w = ng.element($window);

            scope.getWindowDimensions = function () {
                return { 'w': $window.innerWidth, 'h': $window.innerHeight };
            };

            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {

                scope.windowHeight = newValue.h;

                scope.setTreeStyle = function () {
                    return {
                        'width': 300 + 'px', // 树的宽度。
                        'height': newValue.h - 58 + 'px', // 顶部高度是 58 像素。
                        'overflow-y': 'auto',
                        'display': 'inline-block',
                    };
                };


            }, true);

            w.bind('resize', function () { scope.$apply(); });
        };
    });

    // 调整 人员列表 的 高度 和 宽度。
    md.directive('resizeStaffDataTableSize', function ($window) {

        return function (scope, element) {

            var w = ng.element($window);

            scope.getWindowDimensions = function () {
                return { 'w': $window.innerWidth, 'h': $window.innerHeight };
            };

            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {

                scope.windowHeight = newValue.h;

                scope.setStaffDataTableStyle = function () {
                    return {
                        'width': newValue.w - 300 - 182 + 'px', // 182 是菜单 300 是 树，占满整个宽度。
                        'height': newValue.h - 58 + 'px', // 顶部高度是 58 像素。
                        'float': 'left',
                        'overflow-y': 'auto',
                        'display': 'inline-block',
                    };
                };

            }, true);

            w.bind('resize', function () { scope.$apply(); });
        };
    });

    md.directive('resizeDataTable', function ($window) {
        return function (scope, element) {
            var w = angular.element($window);
            scope.getWindowDimensions = function () {
                return {
                    'w': $window.innerWidth,
                    'h': $window.innerHeight
                };
            };
            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                scope.windowWidth = newValue.w;
                scope.windowHeight = newValue.h;
                scope.DataTablestyle = function () {
                    return {
                        'min-height': 530 + 'px',
                    };
                };
            }, true);
            w.bind('resize', function () {
                scope.$apply();
            });
        }
    });






    md.directive('resizeOrgHeight', function ($window) {
        return function (scope, element) {
            var w = angular.element($window);
            scope.getWindowDimensions = function () {
                return {
                    'h': $window.innerHeight
                };
            };
            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                scope.windowHeight = newValue.h;
                scope.style_org = function () {
                    return {
                        'width': 300 + 'px',
                        'height': (newValue.h - 50 - 46 - 36 - 16) + 'px',
                        'overflow-y': 'auto',
                        'display': 'inline-block',
                        'min-height': '470px'
                    };
                };
            }, true);
            w.bind('resize', function () {
                scope.$apply();
            });
        }
    });

    md.directive('orgMenuVisual', [function () {
        return function (scope, element) {
            element.bind('contextmenu', function (e) {
                e.preventDefault();
                return false;
            });
            element.bind('mouseup', function (event) {
                var menuArr = document.getElementsByClassName('orgmenu');
                if (3 == event.which) {
                    //   <div org-menu Removeable="node.nodes && node.nodes.length == 0" addOrg="" addDepart=""></div>org-menu-visual  
                    angular.forEach(menuArr, function (value, key) {
                        value.style.display = 'none';
                    });
                    var ul = element.find('ul');
                    if (event.clientY + 100 < window.innerHeight) {
                        element.find('ul').css({ 'display': 'block', 'position': 'fixed', 'top': event.clientY + "px", 'left': event.clientX + "px" });
                    } else {
                        element.find('ul').css({ 'display': 'block', 'position': 'fixed', 'top': event.clientY - ul.children().length * 33 + "px", 'left': event.clientX + "px" });
                    }
                }
                if (2 == event.which || 1 == event.which) {
                    angular.forEach(menuArr, function (value, key) {
                        value.style.display = 'none';
                    });
                }
            });

            angular.element(document.getElementById('org_tree'))[0].onwheel = function () {
                var menuArr = document.getElementsByClassName('orgmenu');
                angular.forEach(menuArr, function (value, key) {
                    value.style.display = 'none';
                });
            }
        };
    }]);


    //地图高度
    md.directive('resizeHighMapContent', function ($window) {

        return function (scope, element) {

            var w = ng.element($window);

            scope.getWindowDimensions = function () {
                return { 'w': $window.innerWidth, 'h': $window.innerHeight };
            };

            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {

                scope.windowWidth = newValue.w;
                scope.windowHeight = newValue.h;

                scope.setHighMapContentStyle = function () {
                    return {
                        'height': (newValue.h - 50 - 70 - 100 - 40 + 100 + 30 - 3 - 10) + 'px',
                        'width': '100%',//(newValue.w - 240 - 450 -20 ) + 'px',
                        //'overflow-y': 'scroll',
                        'min-width': '525px',
                        'display': 'inline-block',
                        'min-height': '487px'
                    };
                };

            }, true);

            w.bind('resize', function () { scope.$apply(); });
        };
    });
    md.directive('resizeRightChart', function ($window) {
        return function (scope, element) {
            var w = angular.element($window);
            scope.getWindowDimensions = function () {
                return {
                    'w': $window.innerWidth,
                    'h': $window.innerHeight
                };
            };
            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                scope.windowWidth = newValue.w;
                scope.windowHeight = newValue.h;
                scope.RightChartStyle = function () {
                    return {
                        'height': (newValue.h - 50 - 70 - 40 + 2 + 30 - 10) + 'px',
                    };
                };
            }, true);
            w.bind('resize', function () {
                scope.$apply();
            });
        }
    });

    md.directive('nicTextarea', function () {
        return function (scope, element) {
            scope.textArea = new nicEditObj.nicEditor({ buttonList: ['save', 'bold', 'italic', 'underline', 'left', 'center', 'right', 'justify', 'fontSize', 'forecolor', 'bgcolor'] }).panelInstance('test-content');

            nicEditObj.bkLib.onDomLoaded(scope.textArea)
        }
    });
    md.directive('textContent', ['$timeout', function ($timeout) {
        return {
            restrict: "A",
            scope: {
                model: '=ngModel'
            },
            link: function (scope, element, attr) {
                $timeout(function () {
                    angular.element('.nicEdit-main')[0].innerHTML = scope.model;
                }, 500)
            }
        }
    }]);



    md.directive('resizeContentMenu', function ($window) {
        return function (scope, element) {
            var w = angular.element($window);
            scope.getWindowDimensions = function () {
                return {
                    'w': $window.innerWidth,
                    // 'h': $window.innerHeight
                };
            };
            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                scope.windowWidth = newValue.w;
                //scope.windowHeight = newValue.h;
                // scope.DataDefIllHeightStryle = function() {
                //     return {
                //         'width':newValue.w - 240 - 22 + 'px'
                //     };
                // };
                var widthNew = newValue.w - 240 - 22 - 10 - 140;
                var menuArr = document.getElementsByClassName('content_menu_div_div');
                if (menuArr.length * 100 > widthNew) {
                    var btn = document.getElementsByClassName('menu_menu_btn');
                    element.find('button').css({ 'display': 'block' });
                    angular.forEach(menuArr, function (value, key) {
                        if ((key + 1) * 100 < widthNew) {
                            value.style.display = 'block';
                        } else {
                            value.style.display = 'none';
                        }

                    });
                } else {
                    angular.forEach(menuArr, function (value, key) {
                        if ((key + 1) * 100 < widthNew) {
                            value.style.display = 'block';
                        } else {
                            value.style.display = 'block';

                        }
                    });
                }

                var menuArrMore = document.getElementsByClassName('content_menu_div_div_more');
                if (menuArrMore.length != 0) {
                    if (menuArrMore.length * 100 > widthNew) {
                        var btn = document.getElementsByClassName('menu_menu_btn');
                        element.find('button').css({ 'display': 'block' });
                        angular.forEach(menuArrMore, function (value, key) {
                            if ((key + 1) * 100 > widthNew) {
                                value.style.display = 'block';
                            } else {
                                value.style.display = 'none';
                            }

                        });
                    } else {
                        angular.forEach(menuArrMore, function (value, key) {
                            value.style.display = 'none';
                        });
                    }
                }
            }, true);
            w.bind('resize', function () {
                scope.$apply();
            });
        }
    });
    md.directive("dateFormatDire", function () {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, elem, attr, ngModelCtr) {
                ngModelCtr.$parsers.push(function (viewValue) {
                    if (typeof viewValue != "undefined") {
                        return viewValue.getTime();
                    }
                })
            }
        }
    })

    md.directive("inputFormat", function () {
        return {
            restrict: "A",
            scope: {
                model: "=ngModel"
            },
            link: function (scope, ele, attr) {
                var formatRegex;
                switch (attr.inputFormat) {
                    //电话号码的限制输入
                    //1234567890()+,-.
                    case "phone": {
                        formatRegex = /([^\u0030-\u0039,^\u0028-\u0029,^\u002b-\u002e])/g;
                        break;
                    }
                    //数值型限制输入
                    //1234567890
                    case "number": {
                        formatRegex = /([^\u0030-\u0039])/g;
                        break;
                    }
                    //浮点型限制输入
                    //1234567890.   
                    case "float": {
                        formatRegex = /([^\u0030-\u0039,^\u002e])/g;
                        break;
                    }
                    //其他
                    default: {
                        formatRegex = undefined;
                        break;
                    }
                }
                var alreadyDo = false;
                var formatInput = function () {
                    if (!(scope.model === undefined || scope.model === null || !(typeof (scope.model) === "string"))) {
                        var locStart = ele[0].selectionStart;
                        var locEnd = scope.model.length - ele[0].selectionEnd;
                        scope.model = scope.model.replace(/([\u3002])/g, '.');
                        scope.model = scope.model.replace(formatRegex, '');
                        scope.$apply();
                        ele[0].setSelectionRange(locStart, scope.model.length - locEnd);
                    }
                }
                ele.bind("keyup", function () {
                    if (!(formatRegex === undefined)) {
                        formatInput();
                    }
                    alreadyDo = true;
                })
                //若keyup之前丢失焦点无法清除无效字符 则丢失焦点时清除
                // if(!alreadyDo){
                //     ele.bind("blur",function(){
                //         formatInput();
                //     })
                // }   
            }
        }
    })
    //建筑登记滚轴
    md.directive('repeatFinish', function () {
        return {
            link: function (scope, element, attr) {
                //console.log(scope.$index)
                var d = document.getElementById("form-box");
                if (scope.$last == true && scope.scrollChange == true) {
                    if (d.scrollHeight - d.scrollTop - d.clientHeight > 20) {
                        d.scrollTop = d.scrollHeight - d.clientHeight;
                    }
                }
            }
        }
    });
    md.directive('disposalFinish', function () {
        return {
            link: function (scope, element, attr) {
                //console.log(scope.$index)
                var d = document.getElementById("form-box");
                if (scope.addIllegalDisposal == true) {
                    if (d.scrollHeight - d.scrollTop - d.clientHeight > 20) {
                        d.scrollTop = d.scrollHeight - d.clientHeight;
                    }
                }
            }
        }
    })
    //模态框高度自适应
    md.directive('modalHeight', function ($window) {
        return function (scope, element) {
            var w = angular.element($window);
            scope.setModalHeight = function () {
                return {
                    'overflow': 'auto',
                    'height': $window.innerHeight - 175 + 'px',
                    'max-height': '720px'
                };
            };
        }
    });
    //loagin-sso登录效果
    md.directive('loginSsoEvent', function () {
        return function (scope, element) {
            jquery(".main-left td img").click(function () {
                var oldSrc = "images/region/pic_" + jquery(".region-select").attr("regionCode") + "_normal.png";
                jquery(".region-select").attr("src", oldSrc);
                jquery(".main-left td img").removeClass("region-select");
                jquery(this).addClass("region-select");
                var regionSelect = jquery(this).attr("alt");
                jquery(".region-name").text(regionSelect);
                var newSrc = "images/region/pic_" + jquery(this).attr("regionCode") + "_hover.png";
                jquery(this).attr("src", newSrc);
                jquery(".login_account").focus();
            })
            jquery(".main-left td img").mouseover(function () {
                var newSrc = "images/region/pic_" + jquery(this).attr("regionCode") + "_hover.png";
                jquery(this).attr("src", newSrc);
            })
            jquery(".main-left td img").mouseout(function () {
                var newSrc = "images/region/pic_" + jquery(this).attr("regionCode") + "_normal.png";
                if (jquery(this).attr("class") != "region-select") {
                    jquery(this).attr("src", newSrc);
                }
            })
        }
    })
        //指令
        .directive('resizeEditTableHeight', function ($window) {
            return function (scope, element) {
                var w = angular.element($window);
                scope.getWindowDimensions = function () {
                    return {
                        'w': $window.innerWidth,
                        'h': $window.innerHeight
                    };
                };
                scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                    scope.windowHeight = newValue.h;
                    scope.edittablestyle = function () {
                        return {
                            //'width': (newValue.w - 126 - 8 - 8 - 6 - 2 - 20) + 'px',
                            'height': (newValue.h - 120) + 'px',
                            'overflow-y': 'auto',
                        };
                    };
                    scope.DataGridHeightStryle = function () {
                        return {
                            //'width': (newValue.w - 126 - 8 - 8 - 6 - 2 - 20) + 'px',
                            'height': (newValue.h - 215) + 'px',
                            'overflow-y': 'auto',
                        };
                    };

                }, true);
                w.bind('resize', function () {
                    scope.$apply();
                });
            }
        })



    //时分秒时间选择器
    md.directive('jeDate', function () {
        {
            return {
                require: '?ngModel',
                restrict: "A",
                scope: {
                    ngModel: '='
                },
                link: function (scope, element, attr, ngModel) {

                    // Specify how UI should be updated
                    ngModel.$render = function () {
                        element.val(ngModel.$viewValue || '');
                    };
                    // Listen for change events to enable binding
                    element.on('blur keyup change', function () {
                        scope.$apply(read);
                    });

                    // Write data to the model
                    function read() {
                        var val = element.val();
                        ngModel.$setViewValue(val);
                    }

                    $("#" + element[0].id).jeDate({
                        dateCell: "#" + element[0].id,
                        format: attr.format ? attr.format : "YYYY-MM-DD hh:mm:ss",
                        isTime: true,
                        hmsLimit: true,
                        isinitVal: false,
                        isClear: attr.isClear ? attr.isClear : true,
                        minDate: attr.minDate ? utils.parseTime(new Date(), "YYYY-MM-DD hh:mm:ss") : "",
                        choosefun: function (val) {
                            scope.$apply(read);
                            this.isTime = true;//开启时间选择 
                        },  //选中日期后的回调
                        clearfun: function (val) {
                            scope.$apply(read);
                        },   //清除日期后的回调
                        okfun: function (val) {
                            scope.$apply(read);
                        }    //点击确定后的回调
                    })

                }
            }
        }
    })

    // 限制输入框只能输入数字
    md.directive('onlyNum', function () {
        return {
            restrict: "A",
            scope: {
                onlyNum: "=",     // 整数位数
                numNegative: "=", // 是否允许输入负数
                inDecimals: "=",  // 输入时的小数位数
                numPattern: '='   // 自定义正则表达式
            },
            link: function (scope, element) {
                if (scope.numPattern) {
                    var reg = eval(scope.numPattern);
                } else {
                    var negativeExp = typeof scope.numNegative == "boolean" && scope.numNegative ? "[-]?" : "";
                    var integer = isNaN(scope.onlyNum) || (!isNaN(scope.onlyNum) && scope.onlyNum < 0) ? "" : parseInt(scope.onlyNum);
                    var integerExp = integer === "" ? '[0-9]*' :
                        integer === 0 ? "0" : '[0-9]{0,' + integer + '}';
                    var decimal = isNaN(scope.inDecimals) || (!isNaN(scope.inDecimals) && scope.inDecimals < 0) ? "" : parseInt(scope.inDecimals);
                    var decimalExp = decimal === 0 ? "" : '(\\.[0-9]{0,' + decimal + '})?';
                    var reg = new RegExp('^' + negativeExp + integerExp + decimalExp + '$');
                }

                // 允许的按键：如BackSpace,Tab,Delete,F1~F12等
                var allowKeyCode = [8, 9, 13, 46, 108, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123]; // 13 Enter
                // 单独与组合按键：LeftArrow,RightArrow,Home,End
                var funcKeyCode = [35, 36, 37, 39];
                // 数字输入按键
                var numKeyCodeMap = {
                    48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9',
                    96: '0', 97: '1', 98: '2', 99: '3', 100: '4', 101: '5', 102: '6', 103: '7', 104: '8', 105: '9',
                    110: '.', 190: '.', 109: '-', 189: '-', 188: ','
                };
                // Ctrl组合按键
                var ctrlKeyCode = [65, 67, 86, 88]; //A、C、V、X

                var numKeyCode = [];
                angular.forEach(numKeyCodeMap, function (v, k) {
                    if (!isNaN(k))
                        numKeyCode.push(parseInt(k));
                });
                allowKeyCode = allowKeyCode.concat(funcKeyCode).concat(numKeyCode);

                // 获取按下键之后的新值
                function getNewValue(enterValue) {
                    var val = element.val();
                    var selectText = selectHelper.getSelection(element);
                    var pos = selectHelper.getSelectionStart(element);
                    var result = '';
                    if (selectText == '') {
                        var start = val.substring(0, pos);
                        var end = val.substring(pos);
                        result = start + enterValue + end;
                    }
                    else
                        result = val.replace(selectText, enterValue);
                    return result;
                }

                element.bind('keydown', function () {
                    var e = event;
                    var returnValue = false;
                    if ((e.ctrlKey == true && utils.contains(ctrlKeyCode, e.keyCode))
                        || (e.shiftKey == false && utils.contains(allowKeyCode, e.keyCode))
                        || (e.shiftKey == true && (utils.contains(funcKeyCode, e.keyCode)))) {
                        returnValue = true;
                        if (utils.contains(numKeyCode, e.keyCode)) {
                            var pressValue = numKeyCodeMap[e.keyCode] ? numKeyCodeMap[e.keyCode] : "";
                            var newValue = getNewValue(pressValue);
                            returnValue = reg.test(newValue);
                        }
                    }
                    e.returnValue = returnValue;
                    if (returnValue == false && e.preventDefault)
                        e.preventDefault();
                    return returnValue;
                });

                var lastVal = '';
                element.bind('keyup', function () {
                    var e = event;
                    var val = element.val();
                    var isPass = reg.test(val);
                    if (!isPass && !utils.isNullOrEmpty(val))
                        element.val(lastVal);
                    else
                        lastVal = element.val();
                })

                element.bind('paste', function () {
                    var e = event;
                    var clipboardData = e.clipboardData || window.clipboardData;
                    var pasteText = clipboardData.getData('text');
                    var newValue = getNewValue(pasteText);
                    e.returnValue = reg.test(newValue);
                    if (e.returnValue == false && e.preventDefault)
                        e.preventDefault();
                    return e.returnValue;
                });
            }
        }
    })

    //设置使用了该指令的元素的所有子元素中，表单控件是否可以编辑
    md.directive('canEdit', function () {
        return {
            scope: {
                canEdit: '='
            },
            link: function (scope, element, attrs) {
                scope.$watch('canEdit', function (newVal, oldVal) {
                    if (typeof newVal == 'boolean') {
                        var items = $(element).find(':input');
                        if (newVal)
                            items.removeAttr('disabled');
                        else
                            items.attr('disabled', 'disabled');
                    }
                });
            }
        };
    })

    // 树形
    md.directive('comboTree', function () {
        return {
            restrict: 'EA',
            templateUrl: '/partials/common/comboTree.html',
            transclude: true,
            replace: true,
            scope: {
                treeData: '=',      //数据源
                treeModel: '=', //默认选中值的Value,
                btnShow: "=", // 是否显示按钮
                imgColor: '=', //背景色
                isSystemRoot: '=',//系统管理左侧树特殊处理
                isExtend: '=',//是否全部展开
            },
            require: '?uiTree',
            link: function (scope, element, attributes) {
                // 构建树数据
                var dataList = []; // 数据列表，与树数据源指向相同引用
                var count = 0;
                function LoadTreeData(treeNodesData, parentId, flag) {
                    var data = [];
                    if (treeNodesData)
                        angular.forEach(treeNodesData, function (item) {
                            if (item.ParentID == parentId) {
                                var t = {
                                    'Id': item.Id,
                                    'Name': item.Name,
                                    'ParentID': item.ParentID,
                                    'Type': flag,
                                    'Extend': scope.isExtend ? scope.isExtend : false,
                                    'CanDelete': item.CanDelete,
                                    'itemlevel': item.itemlevel,
                                    'itemlevelcode': item.itemlevelcode,
                                    'Nodes': LoadTreeData(treeNodesData, item.Id, 1)
                                };
                                dataList.push(t);
                                this.push(t);
                            }
                        }, data);
                    return data;
                };
                scope.$watch('treeData', function (v) {
                    if (v) {
                        dataList = [];
                        scope.source = LoadTreeData(scope.treeData, null, 0);
                        //不全部展开时,展开2级
                        if (!scope.isExtend) {
                            initExtend();

                            //展开选中项
                            if (scope.selectnode) {
                                ExpendParent(scope.selectnode);
                            }
                        }

                    }
                }, true);

                //默认展开根节点及第二项
                var initExtend = function () {
                    if (scope.source && scope.source.length > 0) {
                        scope.source[0].Extend = true;
                    }
                }


                function GetParentNode(node) {
                    var parent = null;
                    for (var v in dataList) {
                        if (dataList[v].Id == node.ParentID) {
                            parent = dataList[v];
                            break;
                        }
                    }
                    return parent;
                }

                function ExpendParent(node) {
                    var parent = GetParentNode(node);
                    if (parent != null) {
                        parent.Extend = true;
                        ExpendParent(parent);
                    }
                }

                // //外部改变treeModel值时，选中对应的项
                // scope.$watch('treeModel', function (newValue, oldValue) {
                //     if (!(oldValue == undefined && newValue == undefined)) {
                //         scope.selectnode = null;
                //         getNodeByid(scope.treeModel);
                //         if (scope.selectnode) {
                //             ExpendParent(scope.selectnode);
                //         } 

                //     }
                // })

                //获取节点
                function getNodeByid(id) {
        
                    for (var v in dataList) {
                        if (dataList[v].Id == id) {
                             scope.selectnode = dataList[v];
                            break;
                        }
                    }
 
                }

                //选中项
                scope.clickNode = function (newValue) {

                    if (scope.isSystemRoot) {
                        if (newValue.Nodes == null || newValue.Nodes.length == 0) {
                            scope.treeModel = newValue.Id;
                            scope.$parent.clickSystemRootTree(scope.treeModel);
                        }
                        return;
                    }

                    scope.treeModel = newValue.Id;
                    scope.selectnode = newValue;

                    if (scope.$parent.clicktree) {
                        scope.$parent.clicktree(scope.treeModel);
                    }
                    if (scope.$parent.$parent.clickUsertree) {
                        scope.$parent.$parent.clickUsertree(scope.treeModel);
                    }

                    //获取当前点击的节点共有多少同级
                    for (var i = 0; i < dataList.length; i++) {
                        if (dataList[i].Id == newValue.ParentID) {
                            scope.parentLength = dataList[i].Nodes.length;
                            break;
                        }
                    }

                }
                scope.Extend = function (item) {
                    item.Extend = !item.Extend;
                }
                scope.clickTreeBtn = function (item, type) {
                    scope.$parent.$parent.clickTreeBtn(item, type);
                }

            }
        }
    });




    // 树形
    md.directive('comboTreeSelect', function () {
        return {
            restrict: 'EA',
            templateUrl: '/partials/common/comboTreeSelect.html',
            transclude: true,
            replace: true,
            scope: {
                treeData: '=',      //数据源
                treeModel: '=', //默认选中值的Value,
                btnShow: "=", // 是否显示按钮
                imgColor: '=', //背景色
                isNormal: '=',
                treeWidth: '='
            },
            require: '?uiTree',
            link: function (scope, element, attributes) {
                // 构建树数据
                var dataList = []; // 数据列表，与树数据源指向相同引用
                var count = 0;
                function LoadTreeData(treeNodesData, parentId, flag) {
                    var data = [];
                    if (treeNodesData)
                        angular.forEach(treeNodesData, function (item) {
                            if (item.ParentID == parentId) {
                                var t = {
                                    'Id': item.Id,
                                    'Name': item.Name,
                                    'ParentID': item.ParentID,
                                    'Type': flag,
                                    'Extend': false,
                                    'Nodes': LoadTreeData(treeNodesData, item.Id, 1)
                                };
                                dataList.push(t);
                                this.push(t);
                            }
                        }, data);
                    return data;
                };

                scope.$watch('treeData', function (v) {
                    if (v) {
                        dataList = [];
                        scope.source = LoadTreeData(scope.treeData, null, 0);
                        initExtend();
                    }
                }, true);

                //默认展开根节点及第二项
                var initExtend = function () {
                    if (scope.source && scope.source.length > 0) {
                        scope.source[0].Extend = true;
                    }
                }

                //选中项
                scope.clickNode = function (newValue) {
                    scope.treeModel = newValue.Id;
                    scope.displayText = newValue.Name;
                    scope.showTree = false;
                }

                scope.Extend = function (item) {
                    item.Extend = !item.Extend;
                }

                scope.expandTree = function () {
                    scope.showTree = !scope.showTree;
                };

                // 外部改变treeModel值时，选中对应的项
                scope.$watch('treeModel', function (newValue, oldValue) {
                    if (!(oldValue == undefined && newValue == undefined)) {
                        scope.treeModel = newValue;

                        for (var i = 0; i < scope.treeData.length; i++) {
                            if (scope.treeModel == scope.treeData[i].Id) {
                                scope.displayText = scope.treeData[i].Name;
                                break;
                            }
                        }

                    }
                })

                //点击其他除下拉框及显示文本框的其他地方时关闭下拉框
                $(document).mousedown(function (e) {
                    var event = window.event || e;
                    var target = event.target || event.srcElement;
                    var comboTrees = document.getElementsByName('combo_tree');
                    var flag = true;
                    do {
                        if (target == document) {
                            flag = false;
                            break;
                        }
                        for (var i = 0; i < comboTrees.length; i++) {
                            if (target == comboTrees[i]) {
                                flag = false;
                                break;
                            }
                        }
                        if (flag)
                            target = target.parentNode;
                    } while (flag && target != null);

                    if (target == document) {
                        scope.$apply(function () {
                            scope.showTree = false;
                        })
                    }
                })




            }
        }
    });
    // 自定义窗口拖拽
    md.directive('customDraggable', function ($window, $document) {
        return function (scope, element, attr) {
            var startX = 0,
                startY = 0,
                x = 0,
                y = 0;
            var header = angular.element(element[0]);

            var target = element[0],
                modalBox;
            while (angular.element(target).attr('class').indexOf('custom-modal') == -1) {
                target = target.parentNode;
            }
            var modal = angular.element(target);

            header.on('mousedown', mousedown);
            var IsFirst = true;

            function mousedown(e) {
                e.preventDefault();
                header.css({ cursor: 'move' });
                startX = e.pageX;
                startY = e.pageY;
                modal.css({ filter: 'alpha(opacity=70)', opacity: 0.7 });
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            }

            function mousemove(e) {
                var dy = e.pageY - startY;
                var dx = e.pageX - startX;
                startX = e.pageX;
                startY = e.pageY;
                y = modal[0].offsetTop + dy;
                x = modal[0].offsetLeft + dx;
                boundControl();
                modal.css({ top: y + 'px', left: x + 'px' });
            }

            // 边界控制，防止窗口被移到屏幕外
            function boundControl() {
                if (x < -(modal[0].offsetParent.offsetLeft + modal[0].offsetWidth - 50))
                    x = -(modal[0].offsetParent.offsetLeft + modal[0].offsetWidth - 50)
                else if (x > modal[0].offsetParent.offsetWidth - 50)
                    x = modal[0].offsetParent.offsetWidth - 50
                if (y < -modal[0].offsetParent.offsetTop + 40)
                    y = -modal[0].offsetParent.offsetTop + 40;
                else if (y > $window.innerHeight - modal[0].offsetParent.offsetTop - 40)
                    y = $window.innerHeight - modal[0].offsetParent.offsetTop - 40;
            }

            function mouseup(e) {
                header.css({ cursor: 'default' });
                modal.css({ filter: 'alpha(opacity=100)', opacity: 1 });
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }
        };
    })

});