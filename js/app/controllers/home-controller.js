define(['bootstrap/app', 'utils', 'services/usercenter-service', 'services/regulation-service', 'services/staff-service'], function (app, utils) {
    'use strict';
    var moment = require('moment');

    app.controller('home-controller', ['usercenter-service', '$rootScope', '$scope', '$state', '$timeout', '$cacheFactory', 'toaster', '$cookies', '$uibModal', '$http', 'regulation-service', 'staff-service',
        function (usercenterService, $rootScope, $scope, $state, $timeout, $cacheFactory, toaster, $cookies, $uibModal, $http, regulationService, staffService) {

            var authID = $cookies.get('AUTH_ID');

            var reload = $cookies.get('reload');
            if (reload) {
                $cookies.remove("reload");
                location.reload();
            }

            var user = sessionStorage.getItem('loginUser');

            if (user) {
                user = JSON.parse(user);
            }
            //变量
            var define_variable = function () {

                $scope.pager = {
                    size: 10,
                    current: 1
                }
            };

            //加载
            var initialize = function () {

                //获取通知列表
                $scope.selectAdvice = function () {

                    var options = {
                        pageNo: 1,
                        pageSize: 10,
                        conditions: []
                    };
                    usercenterService.getUpToDateAdviceinfos(options, function (response) {
                        $scope.activeItems = response.CurrentList;
                    })
                }

                $scope.selectAdvice();

                //获取留言
                $scope.selectSuggestion = function () {
                    var options = {
                        pageNo: 1,
                        pageSize: 10,
                        conditions: []
                    };
                    options.conditions.push({ key: 'Type', value: 'uptodata10' })
                    usercenterService.getSuggestionList(options, function (response) {
                        $scope.SuggestionItems = response.CurrentList;
                    })
                }

                $scope.selectSuggestion();

                //获取最新的法规
                $scope.selectLawstands = function (flag) {
                    var options = {
                        pageNo: 1,
                        pageSize: 10,
                        conditions: []
                    };
                    options.conditions.push({ key: 'Type', value: 'uptodata10' });
                    options.conditions.push({ key: 'ApproveStatus', value: 3 });
                    if (flag && $scope.clickLbdhChildMenuValue) {
                        options.conditions.push({ key: 'TreeValue', value: $scope.clickLbdhChildMenuValue });
                    }
                    regulationService.getUptodateLawstandardList(options, function (response) {
                        if (flag) {
                            $scope.LbdhTableItems =  response.CurrentList;
                        } else {
                            $scope.LawItems = response.CurrentList;
                        }

                    })
                }
                $scope.selectLawstands(false);




                //类别导航
                regulationService.getHomePageLawsType(function (res) {
                    $scope.LawRegulationItem = res;
                    if (res && res.length > 0) {
                        $scope.SelectLbMenu = $scope.LawRegulationItem[0].id;
                        $scope.LbdhChildMenus = $scope.LawRegulationItem[0].childLists;
                        if ($scope.LbdhChildMenus && $scope.LbdhChildMenus.length > 0) {
                            $scope.clickLbdhChildMenuValue = $scope.LbdhChildMenus[0].id;
                            //查询列表
                            $scope.selectLawstands(true);
                        }
                    }
                })




                $scope.sjtjMenus = [
                    { Name: "上传前十统计" }, { Name: "上传部门统计" }, { Name: "上传分类统计" }
                ]

                $scope.sjtjMenusuValue = '上传部门统计';

                //初始化图表
                regulationService.getHomeChart(function (params) {
                    var allChart = params;

                    $scope.uploadpeopleChart = initChart(allChart.People);
                    $scope.uploadOrgnameChart = initChart(allChart.Orgname);
                    $scope.uploadTypeChart = initChart(allChart.Type);
                })

                var initChart = function (data) {

                    var datax = [];
                    var datay = [];
                    for (var i = 0; i < data.length; i++) {
                        datax.push(data[i].name);
                        datay.push(parseFloat(data[i].count));
                    }

                    var Chart = {
                        options: {
                            chart: {
                                type: 'column'
                            },
                        },

                        title: {
                            text: ''
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: {
                            categories: datax,
                            crosshair: true
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: ''
                            }
                        },
                        tooltip: {
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        exporting: {
                            enabled: false
                        },
                        series: [{
                            name: "个数",
                            data: datay
                        }]

                    }

                    return Chart;
                }




            };

            //方法
            var define_function = function () {

                $scope.clickLbMenu = function (params) {
                    $scope.SelectLbMenu = params.id;
                    $scope.LbdhChildMenus = params.childLists;
                    if ($scope.LbdhChildMenus && $scope.LbdhChildMenus.length > 0) {
                        $scope.clickLbdhChildMenuValue = $scope.LbdhChildMenus[0].id;
                    } else {
                        $scope.clickLbdhChildMenuValue = "";
                    }
                    //查询列表
                    $scope.selectLawstands(true);
                }

                $scope.clickLbdhTable = function (params) {
                    $scope.LbdhSelected = params;
                }

                $scope.clickLbdhChildMenu = function (params) {
                    $scope.clickLbdhChildMenuValue = params.id;
                    //查询列表
                    $scope.selectLawstands(true);
                }

                $scope.clickSjtjMenu = function (params) {
                    $scope.sjtjMenusuValue = params;
                }


                //跳转到系统通知
                $scope.goNotice = function (item) {

                    if (!authID || !user) {
                        isLogined();
                    } else {
                        var sRouter = "main.notice";
                        $rootScope.$emit("menustateChange", { value: sRouter, HeadNew: false });

                        var itemDeal = {};
                        if (item) {
                            itemDeal.clickValue = item.id;
                        } else {
                            itemDeal.clickValue = '';
                        }


                        var data = JSON.stringify(itemDeal);

                        $state.go(sRouter, { "data": data });
                    }



                }


                $scope.goReg = function () {

                    if (!authID || !user) {
                        isLogined();
                    } else {
                        var sRouter = "main.regulationsStandardsIndex";
                        $rootScope.$emit("menustateChange", { value: sRouter, HeadNew: false });
                        $state.go(sRouter);
                    }


                }

                //全文检索
                $scope.Solr = function () {
                    if (!authID || !user) {
                        isLogined();
                    } else {
                        var sRouter = "main.solr";
                        var itemDeal = {};
                        itemDeal.text = $scope.solrText;

                        var data = JSON.stringify(itemDeal);
                        $rootScope.$emit("menustateChange", { value: sRouter, HeadNew: false });

                        $state.go(sRouter, { "data": data });

                    }
                }

                //跳转到用户留言
                $scope.goSuggestion = function (item) {

                    if (!authID || !user) {
                        isLogined();
                    } else {
                        var sRouter = "main.suggestion";
                        $rootScope.$emit("menustateChange", { value: sRouter, HeadNew: false });


                        $state.go(sRouter);
                    }

                }

                //点击类别导航
                $scope.goLaws = function (id) {

                    if (!authID || !user) {
                        isLogined();
                    } else {
                        var sRouter = "main.regulationsStandardsIndex";
                        $rootScope.$emit("menustateChange", { value: sRouter, HeadNew: false });

                        var itemDeal = {};
                        itemDeal.treevalueid = id;
                        var data = JSON.stringify(itemDeal);
                        $state.go(sRouter, { "data": data });
                    }

                }

                //是否登陆
                function isLogined() {
                    var url = 'partials/system/modals/login.html';
                    var modalInstance = $uibModal.open({

                        templateUrl: url,
                        controller: 'login-controller',

                        size: 'sm',
                        resolve: {
                            values: function () {


                                var data = {


                                }
                                return data;
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