define([
  'bootstrap/app',
  'utils',
  'app/config-manager',
  'services/usercenter-service',
  'services/accessory-service',
], function (app, utils) {
  'use strict';

  var config = require('app/config-manager');
  var baseUrl = config.baseUrl();
  app.controller('adviceDetails-controller', [
    '$rootScope',
    '$scope',
    '$state',
    'toaster',
    '$uibModal',
    'usercenter-service',
    '$stateParams',
    'accessory-service',
    'http-service',
    function (
      $rootScope,
      $scope,
      $state,
      toaster,
      $uibModal,
      usercenterService,
      $stateParams,
      accessoryService,
      http
    ) {
      var postData = $stateParams.data;

      //变量
      var define_variable = function () {
        $scope.Attachments = [];
      };

      //加载
      var initialize = function () {
        if (postData) {
          postData = JSON.parse(postData);
        }

        //获取附件信息
        accessoryService.getAccessoryByDirId(
          postData.clickValue,
          function (res) {
            $scope.Attachments = res;
          }
        );
        usercenterService.GetAdviceByID(postData.clickValue, function (res) {
          $scope.data = res;
          $scope.data.inputdate = utils.parseTime(
            new Date($scope.data.inputdate),
            'YYYY-MM-DD hh:mm:ss'
          );
          // angular.element('.nicEdit-main')[0].innerHTML = $scope.data.details;
        });
      };

      //方法
      var define_function = function () {
        $scope.goState = function () {
          var sRouter = '';
          if (postData.type == 'home') {
            sRouter = 'main.home';
            $rootScope.$emit('menustateChange', {
              value: sRouter,
              HeadNew: true,
            });
            $state.go(sRouter);
          } else if (postData.type == 'notice') {
            sRouter = 'main.notice';
            $rootScope.$emit('menustateChange', {
              value: null,
              HeadNew: false,
            });
            var itemDeal = {};
            itemDeal.clickValue = postData.clickValue;
            itemDeal.selectData = postData.selectData;
            var data = JSON.stringify(itemDeal);

            $state.go(sRouter, { data: data });
          } else if (postData.type == 'advice') {
            sRouter = 'main.userCenter';

            var itemDeal = {};
            itemDeal.clickValue = 'advice';
            var data = JSON.stringify(itemDeal);

            $state.go(sRouter, { data: data });
          }
        };

        $scope.canPreview = function (fileName) {
          var pos = fileName.lastIndexOf('.');
          var format = fileName.substring(pos + 1);
          var picType = ['pdf', 'doc', 'txt', 'docx', 'ofd'];
          var res = false;
          angular.forEach(picType, function (value, key) {
            if (value == format.toLowerCase()) {
              res = true;
            }
          });
          return res;
        };
        $scope.downloadAccessory = function (fileId) {
          accessoryService.downloadAccessory(fileId, 'advice');
        };
        $scope.preview = function (fileId) {
          var url =
            baseUrl + '/Foundation/Attachment/getPreView?file=' + fileId;
          var webReaderUrl = config.webReaderUrl();
          window.open(webReaderUrl + encodeURIComponent(http.wrapUrl(url)));
        };
      };

      // 实际运行……
      define_variable();

      initialize();

      define_function();
    },
  ]);
});
