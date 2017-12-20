define(['bootstrap/app', 'utils', 'app/config-manager', 'services/usercenter-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('suggestion-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'usercenter-service', 'ngDialog',
        function ($rootScope, $scope, $state, toaster, $uibModal, usercenterService, ngDialog) {


            //变量
            var define_variable = function () {

                $scope.pager = {
                    size: 10,
                    current: 1
                }

                $scope.tableRow = {
                    selected :0
                }
            };

            //加载
            var initialize = function () {


                //获取留言列表
                $scope.selectSuggestion = function (isPaging) {
                    $scope.isLoaded = false;

                    //通过当前高度计算每页个数
                    var pagesize = parseInt((window.innerHeight - 200) / 40);

                    if (!isPaging) {
                        $scope.pager.current = 1;
                    }

                    $scope.pager.size = pagesize;

                    var options = {
                        pageNo: $scope.pager.current,
                        pageSize: $scope.pager.size,
                        conditions: []
                    };
                    options.conditions.push({ key: 'Type', value: null })
                    if ($scope.Name) {
                        options.conditions.push({ key: 'KeyWords', value: $scope.Name });
                    }

                    usercenterService.getSuggestionList(options, function (response) {
                        $scope.isLoaded = true;
                        $scope.items = response.CurrentList;
                        $scope.pager.total = response.RecordCount;

                        if ($scope.items != null && $scope.items.length > 0) {
                            $scope.clickvalue = $scope.items[0].id;

                        }

                    })
                }
                $scope.selectSuggestion();

            };

            //方法
            var define_function = function () {

                $scope.goState = function () {

                    var sRouter = "main.home";


                    $rootScope.$emit("menustateChange", { value: sRouter, HeadNew: true });
                    $state.go(sRouter);
                }

                //查看和新增
                $scope.showSuggestion = function (item, flag, txt) {


                    var url = 'partials/system/modals/addsuggestion.html';
                    var modalInstance = $uibModal.open({

                        templateUrl: url,
                        controller: 'addsuggestion-controller',
                        size: 600,
                        resolve: {
                            values: function () {
                                var data = {
                                    suggData: item,
                                    Title: txt,
                                    isCheck: flag
                                }

                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (res) {
                        if (!item) {
                            $scope.selectSuggestion();
                        }
                    });


                }

                $scope.clickTable = function (parms) {
                    $scope.clickvalue = $scope.items[parms].id;
                    $scope.tableRow.selected = parms;
                }

                //删除
                $scope.DeleteSuggestion = function () {

                    if (!$scope.clickvalue) {
                        toaster.pop({ type: 'danger', body: '请选择删除对象!' });
                        return;
                    }

                    $scope.text = "确定删除吗？";
                    var modalInstance = ngDialog.openConfirm({
                        templateUrl: 'partials/_confirmModal.html',
                        appendTo: 'body',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope,
                        size: 400,
                        controller: function ($scope) {
                            $scope.ok = function () {

                                usercenterService.DeleteSuggestionByID($scope.clickvalue, function (res) {

                                    $scope.selectSuggestion();
                                })

                                $scope.closeThisDialog(); //关闭弹窗
                            };
                            $scope.cancel = function () {
                                $scope.closeThisDialog(); //关闭弹窗
                            }
                        }
                    });
                }

            };

            // 实际运行……
            define_variable();

            initialize();

            define_function();


        }]);
});