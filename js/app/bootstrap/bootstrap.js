require(['angular','angular-locale_zh-cn', 'bootstrap/app', 'bootstrap/router'], function(ng) {
    'use strict';

    require(['domReady!'], function(document) {
        ng.bootstrap(document, ['rule']);
    });
});
