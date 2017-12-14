(function () {
    angular
        .module('validation.rule', ['validation'])
        .config(['$validationProvider', function ($validationProvider) {
            var expression = {
                required: function (value) {
                    return (!!value) || value === 0;
                },
                GetInfo: function (value) {
                    return (!!value) || value === 0;
                },
                url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                email: /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
                number: /^\d+$/,
                areaNumber: /^\d+(\.\d{1,2})?$/,
                telnumber: /^0\d{2,3}-?\d{7,8}$/,
                floorNum: /^[0-9]+([.][0-9]{1}){0,1}$/,
                ledgerYear: /^(20[0-9]{2})$/,
                ledgerMonth: /^(1[0-2]|[1-9])$/,
                // phonenumberReg: /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/,
                minlength: function (value, scope, element, attrs, param) {
                    return value && (value + '').length >= param;
                },
                maxlength: function (value, scope, element, attrs, param) {
                    return !value || (value + '').length <= param;
                },
                //以下是自定义验证方法
                nullnumber: function (value, scope, element, attrs, param) {
                    return value == undefined || value == "" || /^\d+$/.test(value);

                },
                phonenumber: function (value, scope, element, attrs, param) {
                    return /^(0\d{2,3}-?)?\d{7,8}$/.test(value) || /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value);

                },
                nullphonenumber: function (value, scope, element, attrs, param) {
                    return value == null || value == "" || (/^(0\d{2,3}-?)?\d{7,8}$/.test(value) || /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value));

                },
                //信访特殊要求的电话
                xfphonenumber: function (value, scope, element, attrs, param) {
                    return value == "无" || /^\*+$/.test(value) || /^(0\d{2,3}-?)?\d{7,8}$/.test(value) || /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value);

                },
                nullAreaNumber: function (value, scope, element, attrs, param) {
                    return value == null || value == "" || /^\d+(\.\d{1,2})?$/.test(value);

                },
                nullFloorNum: function (value, scope, element, attrs, param) {
                    return value == null || value == "" || /^[0-9]+([.][0-9]{1}){0,1}$/.test(value);

                },
                lessOrEqual: function (value, scope, element, attrs, param) {
                    if (!(parseFloat(value).toString() == 'NaN' || parseFloat(param).toString() == 'NaN')) {
                        return parseFloat(value) <= parseFloat(param);
                    } else {
                        return false;
                    }
                },
                moreOrEqual: function (value, scope, element, attrs, param) {
                    if (!(parseFloat(value).toString() == 'NaN' || parseFloat(param).toString() == 'NaN')) {
                        return parseFloat(value) >= parseFloat(param);
                    } else {
                        return false;
                    }
                },
                UserID: function (value, scope, element, attrs, param) {
                    return value == null || value == "" || /^\d{17}(\d|x)$/.test(value);
                }
            };

            var defaultMsg = {
                required: {
                    error: '此处为必填项',
                    success: 'It\'s Required'
                },
                GetInfo: {
                    error: '请调取信访件',
                    success: 'It\'s Required'
                },
                url: {
                    error: '输入必须是Url格式',
                    success: 'It\'s Url'
                },
                email: {
                    error: '输入必须是Email格式',
                    success: 'It\'s Email'
                },
                number: {
                    error: '输入必须是数字',
                    success: 'It\'s Number'
                },
                areaNumber: {
                    error: '输入必须是数字且最多保留两位小数',
                    success: 'It\'s areaNumber'
                },
                floorNum: {
                    error: '输入必须是数字且最多保留一位小数',
                    success: 'It\'s floorNum'
                },
                // phonenumber: { error: '输入必须是电话号码格式', success: '' },
                minlength: {
                    error: '输入小于最小长度',
                    success: 'Long enough!'
                },
                maxlength: {
                    error: '输入超出最大长度',
                    success: 'Short enough!'
                },
                //以下是自定义验证方法提示
                nullnumber: {
                    error: '输入必须是数字',
                    success: ' is nullnumber!'
                },
                phonenumber: {
                    error: '输入必须是电话号码格式',
                    success: ' is phonenumber!'
                },
                xfphonenumber: {
                    error: '输入必须是电话号码格式或无或***',
                    success: ' is phonenumber!'
                },
                nullphonenumber: {
                    error: '输入必须是电话号码格式',
                    success: ' is nullphonenumber!'
                },
                nullAreaNumber: {
                    error: '输入必须是数字且最多保留两位小数',
                    success: ' is nullnumber!'
                },
                nullFloorNum: {
                    error: '输入必须是数字且最多保留两位小数',
                    success: ' is nullnumber!'
                },
                lessOrEqual: {
                    error: 'replaceText',
                    success: 'success'
                },
                moreOrEqual: {
                    error: 'replaceText',
                    success: 'success'
                },
                ledgerYear: {
                    error: '请输入正确的台账年份',
                    success: ' is ledgerYear!'
                },
                ledgerMonth: {
                    error: '请输入正确的台账月度',
                    success: ' is ledgerMonth!'
                },
                UserID: {
                    error: '请输入正确格式的身份证号',
                    success: ' is UserID!'
                }
            };
            $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
            $validationProvider.setErrorHTML(function (msg) {
                return "<div class=\"tooltip bottom  bottom-left\" style=\"top: 40px; left: 5px;opacity:1\">"
                    + "<div class=\"tooltip-arrow\" style=\"position:absolute\"></div>"
                    + "<div class=\"tooltip-inner\">" + msg + "</div></div>"
            });
            $validationProvider.showSuccessMessage = false; // or true(default)
            $validationProvider.resetCallback = function (element) {
                // element.parents('.validator-container:first').removeClass('has-error');
                element.val("");
            };
        }]);
}).call(this);
