define(['bootstrap/app', 'utils', 'app/config-manager', 'services/usercenter-service', 'services/system-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('notice-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'usercenter-service', '$stateParams', 'system-service',
        function ($rootScope, $scope, $state, toaster, $uibModal, usercenterService, $stateParams, systemService) {

            var postData = $stateParams.data;



            var dics = JSON.parse(localStorage.getItem('DicItems'));

            $scope.PublishList = dics.Pub;
            //变量
            var define_variable = function () {

                $scope.pager = {
                    size: 10,
                    current: 1
                }
                $scope.searchdata = {};

                if (postData) {
                    postData = JSON.parse(postData);

                }

            };

            //加载
            var initialize = function () {

                //初始化组织机构
                $scope.initOrg = function () {
                    systemService.getOrganizationList(function (params) {
                        $scope.treeDataOrg = [];

                        for (var i = 0; i < params.length; i++) {
                            var data = {
                                Id: params[i].id,
                                Name: params[i].orgname,
                                ParentID: params[i].parentid,
                                CanDelete: params[i].candelete,
                                itemlevel: params[i].itemlevel,
                                itemlevelcode: params[i].itemlevelcode,
                            }
                            $scope.treeDataOrg.push(data);

                        }

                        //保留查询条件
                        if (postData && postData.selectData) {
                            $scope.searchdata = postData.selectData;
                        }
                        if (params != null && params.length > 0) {
                            $scope.selectAdvice();
                        }
                    })
                };

                //获取通知列表
                $scope.selectAdvice = function (isPaging) {
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


                    if ($scope.searchdata.Title) {
                        options.conditions.push({ key: 'Title', value: $scope.searchdata.Title });
                    }
                    if ($scope.searchdata.FiledTimeStart) {
                        options.conditions.push({ key: 'FiledTimeStart', value: $scope.searchdata.FiledTimeStart });
                    }
                    if ($scope.searchdata.FiledTimeEnd) {
                        options.conditions.push({ key: 'FiledTimeEnd', value: $scope.searchdata.FiledTimeEnd });
                    }
                    if ($scope.searchdata.organization) {
                        options.conditions.push({ key: 'organization', value: $scope.searchdata.organization });
                    }

                    usercenterService.getAdviceList(options, function (response) {
                        $scope.isLoaded = true;
                        $scope.items = response.CurrentList;
                        $scope.pager.total = response.RecordCount;

                        if ($scope.items != null && $scope.items.length > 0) {
                            if (postData) {
                                $scope.clickvalue = postData.clickValue;
                            } else {
                                $scope.clickvalue = $scope.items[0].id;
                            }
                        }

                    })
                }
                // $scope.selectAdvice();
                $scope.initOrg();
            };

            //方法
            var define_function = function () {

                $scope.goState = function () {

                    var sRouter = "main.home";
                    $rootScope.$emit("menustateChange", { value: sRouter, HeadNew: true });
                    $state.go(sRouter);
                }
                //调到通知详细界面
                $scope.showAdvice = function (item) {

                    var sRouter = "main.adviceDetails";
                    var itemDeal = {};
                    itemDeal.clickValue = item.id;
                    itemDeal.type = "notice";
                    itemDeal.selectData = $scope.searchdata;

                    var data = JSON.stringify(itemDeal);

                    $state.go(sRouter, { "data": data });

                }

                //时间监听
                $scope.$watch('searchdata.FiledTimeStart', function (newValue, oldValue) {
                    if (newValue) {
                        if ($scope.searchdata.FiledTimeStart > $scope.searchdata.FiledTimeEnd && $scope.searchdata.FiledTimeEnd) {
                            toaster.pop({ type: 'danger', body: '结束时间不能早于开始时间！' });
                            $scope.searchdata.FiledTimeStart = oldValue;
                        }
                    }
                });
                $scope.$watch('searchdata.FiledTimeEnd', function (newValue, oldValue) {
                    if (newValue) {
                        if ($scope.searchdata.FiledTimeStart > $scope.searchdata.FiledTimeEnd) {
                            toaster.pop({ type: 'danger', body: '结束时间不能早于开始时间！' });
                            $scope.searchdata.FiledTimeEnd = oldValue;
                        }
                    }
                });


            };

            // 实际运行……
            define_variable();

            initialize();

            define_function();


        }]);
});