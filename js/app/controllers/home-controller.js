define(['bootstrap/app',  'utils','services/usercenter-service'], function (app,utils) {
    'use strict';
    var moment = require('moment');

    app.controller('home-controller', ['usercenter-service', '$rootScope', '$scope', '$state', '$timeout', '$cacheFactory', 'toaster', '$cookies', '$uibModal',
        function (usercenterService, $rootScope, $scope, $state, $timeout, $cacheFactory, toaster, $cookies, $uibModal) {

            var authID = $cookies.get('AUTH_ID');

            var reload = $cookies.get('reload');
            if (reload) {
                $cookies.remove("reload");
                location.reload();
            }

            var user = localStorage.getItem("loginUser");

            if (user) {
                user = JSON.parse(user);
            }
            //变量
            var define_variable = function () {

                $scope.pager = {
                    size: 10,
                    current: 1
                }

                $scope.userSuggestion = {};
                $scope.userSuggestion.inputuserid = user.id;
                $scope.userSuggestion.inputusername = user.userrealname;
                $scope.userSuggestion.inputdate = utils.format(new Date(), "yyyy-MM-dd");
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

                $scope.items = [
                    { Title: "中华人民共和国核电厂严重事故管理程序发布", Organization: "国防工科局", Date: "2017-12-01" },
                    { Title: "中华人民共和国知识产权海关保护条例信息发布", Organization: "国防工科局", Date: "2017-12-01" },
                    { Title: "中华人民共和国货物进口管理条例信息发布", Organization: "国防工科局", Date: "2017-12-01" },
                    { Title: "中华人民共和国进户关税条例信息发布", Organization: "国防工科局", Date: "2017-12-01" },
                    { Title: "中华人民共和国海关行政处罚实施条例信息发布", Organization: "国防工科局", Date: "2017-12-01" },
                    { Title: "中华人民共和国技术进出口管理条例信息发布", Organization: "国防工科局", Date: "2017-12-01" },
                    { Title: "中华人民共和国知识产权海关保护条例信息发布", Organization: "国防工科局", Date: "2017-12-01" },
                    { Title: "中华人民共和国货物进出口管理信息条例", Organization: "国防工科局", Date: "2017-12-01" },
                    { Title: "中华人民共和国进出口关税条例信息发布", Organization: "国防工科局", Date: "2017-12-01" },
                    { Title: "中华人民共和国海关行政处罚实施条例信息发布", Organization: "国防工科局", Date: "2017-12-01" }
                ]

                $scope.pager.total = 10;

                $scope.NewRegulationItem = [
                    {
                        Name: "国家行政文件",
                        Childs: [
                            { Name: "国务院法规" }, { Name: "国家法律" }, { Name: "部门规章" }
                        ]
                    },
                    {
                        Name: "国家标准",
                        Childs: [
                            { Name: "环境保护标准" }, { Name: "能源局标准" }, { Name: "国家标准" }, { Name: "核行业标准" }, { Name: "电力行业标准" }, { Name: "其他SS" }
                        ]
                    },
                    {
                        Name: "国家公约及标准",
                        Childs: [
                            { Name: "IEC" }, { Name: "IAEA安全标准" }, { Name: "国际公约" }, { Name: "其他国家表标准" }, { Name: "其他" }
                        ]
                    },
                    {
                        Name: "技术文档",
                        Childs: [
                            { Name: "论文" }, { Name: "期刊" }, { Name: "会议" }, { Name: "其他" }
                        ]
                    }
                ];


                $scope.LbdhMenus = [
                    { Name: '国家行政' }, { Name: '国家标准' }, { Name: '国家公约及标准' }, { Name: '技术文档' }
                ]

                $scope.SelectLbMenu = "国家行政";

                $scope.LbdhChildMenus = [
                    { Name: "国务院法规" }, { Name: "国家法律" }, { Name: "部门规章" }
                ]

                $scope.clickLbdhChildMenuValue = '国家法律';

                $scope.sjtjMenus = [
                    { Name: "上传前十统计" }, { Name: "上传部门统计" }, { Name: "上传分类统计" }
                ]

                $scope.sjtjMenusuValue = '上传部门统计';


                $scope.LbdhTableItems = [
                    { Title: "中华人民共和国劳动合同法", Number: "第三十七号", MaterialDate: "2014-12-09" },
                    { Title: "中华人民共和国特种设备安全法", Number: "第四条", MaterialDate: "2014-12-09" },
                    { Title: "中华人民共和国环境保护法", Number: "12-8", MaterialDate: "2016-08-21" },
                    { Title: "中华人民共和国安全生产法", Number: "第52号", MaterialDate: "2014-11-19" },
                    { Title: "中华人民共和国职业病防治法", Number: "第五十条", MaterialDate: "2013-05-05" },

                    { Title: "中华人民共和国劳动法", Number: "第69条", MaterialDate: "2015-11-19" },
                    { Title: "中华人民共和国预算法", Number: "第28号", MaterialDate: "2014-06-12" },
                    { Title: "中华人民共和国安全生产法", Number: "第52号", MaterialDate: "2014-11-19" },
                    { Title: "中华人民共和国劳动合同法", Number: "第三十七号", MaterialDate: "2014-12-09" },
                    { Title: "中华人民共和国安全生产法", Number: "第52号", MaterialDate: "2014-11-19" }
                ]

                $scope.yhlys = [
                    { Name: "沙发" }, { Name: "是否可以在能源标准中加一个分类" }, { Name: "系统使用流畅，不错" }, { Name: "关于法规的分类依据有哪些" }, { Name: "技术文档是否可以扩展些" }, { Name: "详细信息" }
                ]


                $scope.SjtjChart = {
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
                        categories: [
                            '部门一',
                            '部门二',
                            '部门三',
                            '部门四',
                            '部门五',
                            '部门六',
                            '部门七',

                        ],
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
                        data: [59, 82, 76, 36, 62, 94, 46]
                    }]


                };

            };

            //方法
            var define_function = function () {

                $scope.clickLbMenu = function (params) {
                    $scope.SelectLbMenu = params;
                }

                $scope.clickLbdhTable = function (params) {
                    $scope.LbdhSelected = params;
                }

                $scope.clickLbdhChildMenu = function (params) {
                    $scope.clickLbdhChildMenuValue = params;
                }

                $scope.clickSjtjMenu = function (params) {
                    $scope.sjtjMenusuValue = params;
                }


                //跳转到系统通知
                $scope.goNotice = function (item) {

                    if (!authID) {
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

                    if (!authID) {
                        isLogined();
                    } else {
                        var sRouter = "main.regulationsStandardsIndex";
                        $rootScope.$emit("menustateChange", { value: sRouter, HeadNew: false });
                        $state.go(sRouter);
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