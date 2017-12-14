define(['angular', 'angular-cookies', 'angular-animate', 'angular-messages','angular-resource','angular-sanitize', 'angular-ui-router', 'angular-ui-tree', 'ui-bootstrap', 'directives/main-directives', 
'filters/main-filters', 'angular-file-upload', 'moment', 'highstock', 'standalone-framework', 'map', 'highcharts-ng','hash',
 'exporting', 'ipaddr', 'jquery','jeDate','jeDatemin', 'nicEdit', 'ng-file-upload-shim', 'ng-file-upload', 'FileAPIStart', 'rzslider', 'split', 'angular-validation', 'angular-validation-rule','app/config-manager', 'toaster', 'ngDialog','isteven-multi-select'], function (ng) {
    
    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    // 如果需要添加其他的 AngularJS 库，则在这个文件里面添加依赖关系。
    // directives/filters 需要在 app bootstrap 之前注入到 app 中，所以需要在此处加载。
    var app = ng.module('pumpkin', ['ngCookies', 'ngMessages', 'ngAnimate', 'ngResource', 'ngLocale', 'ngSanitize', 'ui.router', 'ui.tree', 'ui.bootstrap', 'main-directives', 'main-filters', 'highcharts-ng', 'angularFileUpload', 'ngFileUpload', 'rzModule', 'validation', 'validation.rule', 'toaster', 'ngDialog','isteven-multi-select']);
    app.constant('defaultPassword','8888888')
       .constant('baseUrl', baseUrl)


       
    return app;
});