require.config({
    baseUrl: 'js/lib',
    paths: {
        'angular': '../../angular/angular',
        'angular-cookies': '../../angular/angular-cookies.min',
        'angular-animate': '../../angular/angular-animate.min',
        'angular-route': '../../angular/angular-route.min',
        'angular-locale_zh-cn': '../../angular/i18n/angular-locale_zh-cn',
        'angular-messages': '../../angular/angular-messages.min',
        'angular-resource': '../../angular/angular-resource.min',
        'angular-sanitize': '../../angular/angular-sanitize',
        'angular-ui-tree': '../../angular-ui/angular-ui-tree.min',
        'angular-ui-router': '../../angular-ui/angular-ui-router.min',
        'angular-file-upload': '../../angular-ui/angular-file-upload.min',
        'ng-file-upload-shim': 'ng-file-upload-shim.min',
        'ng-file-upload': 'ng-file-upload.min',
        'FileAPIStart': 'FileAPIStart',

        'ui-bootstrap': '../../angular-ui/ui-bootstrap-tpls-1.3.3.min',

        //  'moment':'moment',
        'setting': '../app/setting',

        'jquery': 'jquery-1.11.1.min',
        'jeDate': 'jquery.jedate',
        'jeDatemin': 'jquery.jedate.min',

        'highstock': 'highstock',

        'hash': 'hash',
        'svg': 'svg.min',

        'standalone-framework': 'standalone-framework',
        'map': 'map',

        'exporting': 'exporting',

        'highcharts-ng': 'highcharts-ng.min',
        'rzslider': 'rzslider.min',

        'app': '../app',
        'bootstrap': '../app/bootstrap',

        'ctrls': '../app/controllers',
        'services': '../app/services',
        'directives': '../app/directives',
        'filters': '../app/filters',

        'utilities': '../app/utilities',
        'utils': '../app/utilities/utils',
        'ipaddr': 'ipaddr.min',
        'nicEdit': 'nicEdit',

        'toaster': 'toaster.min',
        'ngDialog': 'ngDialog.min',

        'split': 'split.min',
        'ClusterLayer': 'ClusterLayer',
        'angular-validation': 'angular-validation',
        'angular-validation-rule': 'angular-validation-rule',
        'isteven-multi-select': 'isteven-multi-select',

    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-cookies': {
            deps: ['angular']
        },
        'angular-route': {
            deps: ['angular']
        },
        'angular-animate': {
            deps: ['angular']
        },
        'angular-locale_zh-cn': {
            deps: ['angular']
        },
        'angular-messages': {
            deps: ['angular']
        },
        'angular-resource': {
            deps: ['angular']
        },
        'angular-sanitize': {
            deps: ['angular']
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        'angular-ui-tree': {
            deps: ['angular']
        },
        'angular-file-upload': {
            deps: ['angular']
        },
        'FileAPIStart': {
            deps: ['angular']
        },
        'ng-file-upload-shim': {
            deps: ['angular', 'FileAPIStart']
        },
        'ng-file-upload': {
            deps: ['angular', 'ng-file-upload-shim', 'FileAPIStart']
        },
        'ui-bootstrap': {
            deps: ['angular']
        },
        'toaster': {
            deps: ['angular']
        },
        'sha256': {
            exports: 'CryptoJS'
        },
        'aes': {
            exports: 'CryptoJS'
        },
        'highstock': {
            deps: ['jquery']
        },
        'map': {
            deps: ['highstock']
        },
        'exporting': {
            deps: ['highstock']
        },
        'ipaddr': {
            exports: 'ipaddr'
        },
        'highcharts-ng': {
            deps: ['angular']
        },
        'nicEdit': {
            exports: 'nicEditObj'
        },
        'rzslider': {
            deps: ['angular']
        },
        'hash': {
            exports: 'Hash'
        },
        'angular-validation': {
            deps: ['angular']
            // , exports: 'angular-validation'
        },
        'angular-validation-rule': {
            deps: ['angular']
            // , exports: 'angular-validation-rule'
        },
        'jedate': {
            deps: ['jquery']
        },
        'jedatemin': {
            deps: ['jedate']
        },
        'isteven-multi-select': {
            deps: ['angular']
        }

    },
    deps: ['js/app/bootstrap/bootstrap.js'],


    // Chrome 调试模式，Network 界面，勾选 Disable cache，禁用缓存。
    //发布时 带上本次更新的版本号(格式yyyyMMdd00)  避免发布好需要刷新页面
    urlArgs: window.require.urlArgs
});