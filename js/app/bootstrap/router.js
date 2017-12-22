define(['bootstrap/app',
    'ctrls/main-controller', 'ctrls/home-controller',
    'ctrls/system/reference-controller',
    'ctrls/system/examCheck-controller',
    'ctrls/system/settings-controller',
    'ctrls/notice-controller',
    'ctrls/system/treeEdit-controller',
    'ctrls/system/roleManage-controller',
    'ctrls/system/userManage-controller',
    'ctrls/system/login-controller',
    'ctrls/system/advice-controller',
    'ctrls/system/favorite-controller',
    'ctrls/system/addsuggestion-controller',
    'ctrls/system/suggestionFeedBack-controller',
    'ctrls/suggestion-controller',
    'ctrls/solr-controller',
    'ctrls/RegulationsStandards/regulationsStandards-index-controller',
    'ctrls/RegulationsStandards/regulationsStandards-addOrEdit-controller',
    'ctrls/RegulationsStandards/regulationsStandards-detail-controller',
    'ctrls/TechnicalDocuments/technicalDocuments-index-controller',
    'ctrls/TechnicalDocuments/technicalDocuments-addOrEdit-controller',
    'ctrls/TechnicalDocuments/technicalDocuments-detail-controller',
    'ctrls/UserCenter/userCenter-index-controller',
    'ctrls/SystemSetup/systemSetup-index-controller',

    'ctrls/error-controller'], function (app) {
        'use strict';

        app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

            //$httpProvider.interceptors.push('interceptorService');

            // 定义 App 中的各种状态
            $stateProvider.state('login', {
                url: '/login',
                // templateUrl: 'partials/login-sso.htm',
                templateUrl: 'partials/login.htm',
                controller: 'login-controller'
            });

            // 出错
            $stateProvider.state('error', {
                url: '/error',
                templateUrl: 'partials/error.htm',
                controller: 'error-controller'
            });

            $stateProvider.state('main', {
                url: '/',
                templateUrl: 'partials/main.htm',
                controller: 'main-controller'
            });

            // url 前面加上 ^ 表示 绝对路由，虽然是子状态，但是 url 不会跟随在父状态后面。


            // 首页
            $stateProvider.state('main.home', {
                url: 'home',
                templateUrl: 'partials/home.htm',
                controller: 'home-controller'
            });

            //系统提示
            $stateProvider.state('main.notice', {
                url: 'notice/{data}',
                templateUrl: 'partials/notice.html',
                controller: 'notice-controller'
            });

            //用户留言
            $stateProvider.state('main.suggestion', {
                url: 'suggestion',
                templateUrl: 'partials/suggestion.html',
                controller: 'suggestion-controller'
            });

            //全文检索
            $stateProvider.state('main.solr', {
                url: 'solr/{data}',
                templateUrl: 'partials/solr.html',
                controller: 'solr-controller'
            });

            $stateProvider.state('main.map', {
                url: 'map',
                templateUrl: 'partials/map.htm',
                controller: 'map-controller'
            });

            // 法规标准
            $stateProvider.state('main.regulationsStandardsIndex', {
                url: 'regulationsStandardsIndex/{data}',
                templateUrl: 'partials/RegulationsStandards/regulationsStandards-index.htm',
                controller: 'regulationsStandards-index-controller'
            });

            //法规标准新增和编辑
            $stateProvider.state('main.regulationsStandardsAddOrEdit', {
                url: 'regulationsStandardsAddOrEdit/{data}',
                templateUrl: 'partials/RegulationsStandards/regulationsStandards-addOrEdit.htm',
                controller: 'regulationsStandards-addOrEdit-controller'
            });

            //法规标准详细
            $stateProvider.state('main.regulationsStandardsDetail', {
                url: 'regulationsStandardsDetail/{data}',
                templateUrl: 'partials/RegulationsStandards/regulationsStandards-detail.htm',
                controller: 'regulationsStandards-detail-controller'
            });

            // 技术文档
            $stateProvider.state('main.technicalDocuments', {
                url: 'technicalDocuments/{data}',
                templateUrl: 'partials/TechnicalDocuments/technicalDocuments-index.htm',
                controller: 'technicalDocuments-index-controller'
            });

            //技术文档新增和编辑
            $stateProvider.state('main.technicalDocumentsAddOrEdit', {
                url: 'technicalDocumentsAddOrEdit/{data}',
                templateUrl: 'partials/TechnicalDocuments/technicalDocuments-addOrEdit.htm',
                controller: 'technicalDocuments-addOrEdit-controller'
            });

            //技术文档详细
            $stateProvider.state('main.technicalDocumentsDetail', {
                url: 'technicalDocumentsDetail/{data}',
                templateUrl: 'partials/TechnicalDocuments/technicalDocuments-detail.htm',
                controller: 'technicalDocuments-detail-controller'
            });

            // 用户中心
            $stateProvider.state('main.userCenter', {
                url: 'userCenter/{data}',
                templateUrl: 'partials/UserCenter/userCenter-index.htm',
                controller: 'userCenter-index-controller'
            });
            // 系统关系
            $stateProvider.state('main.systemSetup', {
                url: 'systemSetup',
                templateUrl: 'partials/SystemSetup/systemSetup-index.htm',
                controller: 'systemSetup-index-controller'
            });


            // 如果出现了没有存在的状态，则进入默认的 URL。 settings-controller
            // 这里的 URL 一定是上面的 state 定义中存在的 URL。
            // 如果上面的状态定义使用了 子状态，并且子状态 没有使用 绝对路由，这个地方的判断会出错。
            // 好像不会识别子状态的 url，然后就出现很多 url 找不到，被跳转到默认的地址。
            $urlRouterProvider.otherwise('/home');
        });
    });