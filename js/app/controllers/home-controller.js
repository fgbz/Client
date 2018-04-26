define(['bootstrap/app', 'utils', 'services/usercenter-service', 'services/regulation-service', 'services/staff-service', 'app/config-manager', 'services/technical-service'], function (app, utils) {
    'use strict';
    var moment = require('moment');
    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();

    app.controller('home-controller', ['usercenter-service', '$rootScope', '$scope', '$state', '$timeout', '$cacheFactory', 'toaster', '$cookies', '$uibModal', 'http-service', 'regulation-service', 'staff-service', 'technical-service',
        function (usercenterService, $rootScope, $scope, $state, $timeout, $cacheFactory, toaster, $cookies, $uibModal, http, regulationService, staffService, technicalService) {

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

                $scope.userSuggestion = {};
                if (user) {
                    $scope.userSuggestion.id = '';
                    $scope.userSuggestion.inputuserid = user.id;
                    $scope.userSuggestion.inputname = user.userrealname;
                    $scope.userSuggestion.inputdate = utils.format(new Date(), "yyyy-MM-dd HH:mm:ss");
                }
                $scope.countshow = false;


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
                    // options.conditions.push({ key: 'Type', value: 'uptodata10' });
                    options.conditions.push({ key: 'ApproveStatus', value: 3 });
                    if (flag) {
                        if ($scope.clickLbdhChildMenuValue) {
                            options.conditions.push({ key: 'TreeValue', value: $scope.clickLbdhChildMenuValue });
                        } else {
                            options.conditions.push({ key: 'TreeValue', value: $scope.SelectLbMenu });
                        }
                    }
                    regulationService.getUptodateLawstandardList(options, function (response) {
                        if (flag) {
                            $scope.LbdhTableItems = response;
                        } else {
                            $scope.LawItems = response;
                        }

                    })
                }
                $scope.selectLawstands(false);




                //法规类别导航
                regulationService.getHomePageLawsType(function (res) {
                    $scope.LawRegulationItem = res;
                    $scope.LbdhChildMenus = [];
                    if (res && res.length > 0) {
                        $scope.SelectLbMenu = $scope.LawRegulationItem[0].id;
                        $scope.childDList = $scope.LawRegulationItem[0].childLists;
                        //加入前四项
                        if ($scope.childDList && $scope.childDList.length > 0) {
                            $scope.LbdhChildMenus.push($scope.childDList[0]);
                            if ($scope.childDList.length > 1) {
                                $scope.LbdhChildMenus.push($scope.childDList[1]);
                            }
                            if ($scope.childDList.length > 2) {
                                $scope.LbdhChildMenus.push($scope.childDList[2]);
                            }
                            if ($scope.childDList.length > 3) {
                                $scope.LbdhChildMenus.push($scope.childDList[3]);
                            }
                            $scope.clickLbdhChildMenuValue = $scope.LbdhChildMenus[0].id;

                            $scope.lawindex = 0;
                            //查询列表
                            $scope.selectLawstands(true);
                        } else {
                            $scope.clickLbdhChildMenuValue = "";
                        }
                    }

                    //获取数量
                    regulationService.getHomeLawsCount(function (params) {
                        $scope.countshow = true;
                        $scope.LawRegulationItem = params;
                    })
                });

                //法规导航左移
                $scope.movetLaw = function (type, lbtype) {

                    if (lbtype == 'Law') {
                        if (type == 'left') {
                            $scope.lawindex--;
                        } else {
                            $scope.lawindex++;
                        }
                        $scope.LbdhChildMenus = [];
                        $scope.LbdhChildMenus.push($scope.childDList[$scope.lawindex]);
                        $scope.LbdhChildMenus.push($scope.childDList[$scope.lawindex + 1]);
                        $scope.LbdhChildMenus.push($scope.childDList[$scope.lawindex + 2]);
                        $scope.LbdhChildMenus.push($scope.childDList[$scope.lawindex + 3]);
                        if (type == 'left') {
                            $scope.clickLbdhChildMenuValue = $scope.LbdhChildMenus[0].id;
                        } else {
                            $scope.clickLbdhChildMenuValue = $scope.LbdhChildMenus[3].id;
                        }

                        //查询列表
                        $scope.selectLawstands(true);
                    } else {
                        if (type == 'left') {
                            $scope.tecindex--;
                        } else {
                            $scope.tecindex++;
                        }
                        $scope.TecLbdhChildMenus = [];
                        $scope.TecLbdhChildMenus.push($scope.TecchildDList[$scope.tecindex]);
                        $scope.TecLbdhChildMenus.push($scope.TecchildDList[$scope.tecindex + 1]);
                        $scope.TecLbdhChildMenus.push($scope.TecchildDList[$scope.tecindex + 2]);
                        $scope.TecLbdhChildMenus.push($scope.TecchildDList[$scope.tecindex + 3]);
                        if (type == 'left') {
                            $scope.TecclickLbdhChildMenuValue = $scope.TecLbdhChildMenus[0].id;
                        } else {
                            $scope.TecclickLbdhChildMenuValue = $scope.TecLbdhChildMenus[3].id;
                        }

                        //查询列表
                        $scope.selectTecstands();
                    }

                }


                //查询技术文件
                $scope.selectTecstands = function () {
                    var options = {
                        pageNo: 1,
                        pageSize: 10,
                        conditions: []
                    };
                    options.conditions.push({ key: 'ApproveStatus', value: 2 });
                    if ($scope.TecclickLbdhChildMenuValue) {
                        options.conditions.push({ key: 'TreeValue', value: $scope.TecclickLbdhChildMenuValue });
                    } else {
                        options.conditions.push({ key: 'TreeValue', value: $scope.SelectTecLbMenu });
                    }
                    technicalService.getTechnicalList(options, function (response) {

                        $scope.TecLbdhTableItems = response.CurrentList;


                    })

                }

                //技术文档导航
                technicalService.getHomePageTecsType(function (res) {
                    $scope.TecRegulationItem = res;
                    $scope.TecLbdhChildMenus = [];
                    if (res && res.length > 0) {
                        $scope.SelectTecLbMenu = $scope.TecRegulationItem[0].id;

                        $scope.TecchildDList = $scope.TecRegulationItem[0].childLists;
                        //加入前四项
                        if ($scope.TecchildDList && $scope.TecchildDList.length > 0) {
                            $scope.TecLbdhChildMenus.push($scope.TecchildDList[0]);
                            if ($scope.TecchildDList.length > 1) {
                                $scope.TecLbdhChildMenus.push($scope.TecchildDList[1]);
                            }
                            if ($scope.TecchildDList.length > 2) {
                                $scope.TecLbdhChildMenus.push($scope.TecchildDList[2]);
                            }
                            if ($scope.TecchildDList.length > 3) {
                                $scope.TecLbdhChildMenus.push($scope.TecchildDList[3]);
                            }
                            $scope.TecclickLbdhChildMenuValue = $scope.TecLbdhChildMenus[0].id;

                            $scope.tecindex = 0;
                            //查询列表
                            $scope.selectTecstands();
                        } else {
                            $scope.TecclickLbdhChildMenuValue = "";
                        }
                    }
                });




                $scope.sjtjMenus = [
                    { Name: "按上传人统计" }, { Name: "按上传部门统计" }, { Name: "按上传分类统计" }
                ]

                $scope.sjtjMenusuValue = '按上传部门统计';

                //初始化图表
                regulationService.getHomeChart(function (params) {
                    var allChart = params;

                    $scope.uploadpeopleChart = initChart(allChart.People, "按上传人统计（TOP10）");
                    $scope.uploadOrgnameChart = initChart(allChart.Orgname, "按上传部门统计（TOP10）");
                    $scope.uploadTypeChart = initChart(allChart.Type, "按上传分类统计（TOP10）");
                })

                var initChart = function (data, title) {

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
                            lang: {
                                printChart: "打印图表",
                                downloadJPEG: "下载JPEG 图片",
                                downloadPDF: "下载PDF文档",
                                downloadPNG: "下载PNG 图片",
                                downloadSVG: "下载SVG 矢量图",
                                exportButtonTitle: "导出图片"
                            }

                        },

                        title: {
                            text: ""
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
                            minPadding: 0.2,
                            allowDecimals: false,
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
                            name: title,
                            data: datay,
                            dataLabels: {
                                enabled: true,
                                allowOverlap: true,
                                formatter: function () {
                                    if (this.y > 0) {
                                        return this.y;
                                    } else {
                                        return 0;
                                    }

                                }


                            }
                        }]

                    }

                    return Chart;
                }




            };

            //方法
            var define_function = function () {

                $scope.clickLbMenu = function (params, type) {
                    if (type == 'Law') {
                        $scope.SelectLbMenu = params.id;
                        $scope.childDList = params.childLists;
                        $scope.LbdhChildMenus = [];

                        if (!params.childLists || params.childLists.length == 0) {
                            $scope.childDList.push(params);
                        }

                        //加入前四项
                        if ($scope.childDList && $scope.childDList.length > 0) {
                            $scope.LbdhChildMenus.push($scope.childDList[0]);
                            if ($scope.childDList.length > 1) {
                                $scope.LbdhChildMenus.push($scope.childDList[1]);
                            }
                            if ($scope.childDList.length > 2) {
                                $scope.LbdhChildMenus.push($scope.childDList[2]);
                            }
                            if ($scope.childDList.length > 3) {
                                $scope.LbdhChildMenus.push($scope.childDList[3]);
                            }
                            $scope.clickLbdhChildMenuValue = $scope.LbdhChildMenus[0].id;

                            $scope.lawindex = 0;
                        } else {
                            $scope.clickLbdhChildMenuValue = "";
                        }
                        //查询列表
                        $scope.selectLawstands(true);
                    } else {
                        $scope.SelectTecLbMenu = params.id;

                        $scope.TecchildDList = params.childLists;

                        $scope.TecLbdhChildMenus = [];
                        if (!params.childLists || params.childLists.length == 0) {
                            $scope.TecLbdhChildMenus.push(params);
                        }

                        //加入前四项
                        if ($scope.TecchildDList && $scope.TecchildDList.length > 0) {
                            $scope.TecLbdhChildMenus.push($scope.TecchildDList[0]);
                            if ($scope.TecchildDList.length > 1) {
                                $scope.TecLbdhChildMenus.push($scope.TecchildDList[1]);
                            }
                            if ($scope.TecchildDList.length > 2) {
                                $scope.TecLbdhChildMenus.push($scope.TecchildDList[2]);
                            }
                            if ($scope.TecchildDList.length > 3) {
                                $scope.TecLbdhChildMenus.push($scope.TecchildDList[3]);
                            }
                            $scope.TecclickLbdhChildMenuValue = $scope.TecLbdhChildMenus[0].id;

                            $scope.tecindex = 0;
                        } else {
                            $scope.TecclickLbdhChildMenuValue = "";
                        }
                        //查询列表
                        $scope.selectTecstands();
                    }

                }



                $scope.clickLbdhTable = function (params, type, item) {
                    if (type == 'Law') {
                        $scope.LbdhSelected = params;

                        $scope.goLawDetail(item);


                    } else {
                        $scope.TecLbdhSelected = params;
                        $scope.goTecDetail(item);
                    }

                }

                //跳转法规
                $scope.goLawDetail = function (item) {
                    if (!authID || !user) {
                        isLogined();
                    } else {
                        var itemdata = angular.copy(item);

                        regulationService.AddLawstandardCount(itemdata, function () {
                            var sRouter = "main.regulationsStandardsDetail";

                            var itemDeal = {};
                            itemDeal.type = "check";
                            itemDeal.clickValue = 'home';
                            itemDeal.item = { id: item.id };
                            // $rootScope.$emit("menustateChange", { value: sRouter, HeadNew: false });
                            var data = JSON.stringify(itemDeal);

                            // $state.go(sRouter, { "data": data });
                            var url = $state.href(sRouter, { "data": data });
                            window.open(url, '_blank');
                        })
                    }


                }

                //跳转技术文件
                $scope.goTecDetail = function (item) {
                    if (!authID || !user) {
                        isLogined();
                    } else {
                        var itemdata = angular.copy(item);
                        var sRouter = "main.technicalDocumentsDetail";
                        // $rootScope.$emit("menustateChange", { value: sRouter, HeadNew: false });
                        var itemDeal = {};
                        itemDeal.type = "check";
                        itemDeal.clickValue = 'home';
                        itemDeal.item = { id: item.id };

                        var data = JSON.stringify(itemDeal);

                        // $state.go(sRouter, { "data": data });
                        var url = $state.href(sRouter, { "data": data });
                        window.open(url, '_blank');

                    }


                }



                $scope.clickLbdhChildMenu = function (params, type) {
                    if (type == 'Law') {
                        $scope.clickLbdhChildMenuValue = params.id;
                        //查询列表
                        $scope.selectLawstands(true);
                    } else {
                        $scope.TecclickLbdhChildMenuValue = params.id;
                        //查询列表
                        $scope.selectTecstands();
                    }

                }

                //留言反馈
                $scope.goSuggestDetail = function (item) {
                    if (!authID || !user) {
                        isLogined();
                    } else {
                        var url = 'partials/system/modals/suggestionFeedBack.html';
                        var modalInstance = $uibModal.open({

                            templateUrl: url,
                            controller: 'suggestionFeedBack-controller',
                            size: 600,
                            backdrop: 'static',
                            resolve: {
                                values: function () {
                                    var data = {
                                        suggData: item
                                    }

                                    return data;
                                }
                            }
                        });
                        modalInstance.result.then(function (res) {

                        });
                    }
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
                        $rootScope.$emit("menustateChange", { value: null, HeadNew: false });

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

                //调到通知详细界面
                $scope.goNoticeDetails = function (item) {

                    if (!authID || !user) {
                        isLogined();
                    } else {
                        var sRouter = "main.adviceDetails";
                        $rootScope.$emit("menustateChange", { value: null, HeadNew: false });
                        var itemDeal = {};
                        itemDeal.clickValue = item.id;
                        itemDeal.type = "home";

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

                $scope.goTec = function () {

                    if (!authID || !user) {
                        isLogined();
                    } else {
                        var sRouter = "main.technicalDocuments";
                        $rootScope.$emit("menustateChange", { value: sRouter, HeadNew: false });
                        $state.go(sRouter);
                    }


                }

                //回车
                $scope.PressSolr = function (target) {
                    if (target.keyCode == 13) {
                        $scope.Solr();

                    }
                }

                //全文检索
                $scope.Solr = function () {
                    if (!authID || !user) {
                        isLogined();
                    } else {

                        //什么都不输入,不跳转
                        if (!$scope.solrText) {
                            return;
                        }

                        var sRouter = "main.solr";
                        var itemDeal = {};
                        itemDeal.text = $scope.solrText;

                        var data = JSON.stringify(itemDeal);
                        $rootScope.$emit("menustateChange", { value: null, HeadNew: false });

                        $state.go(sRouter, { "data": data });

                    }
                }

                //跳转到用户留言
                $scope.goSuggestion = function (item) {

                    if (!authID || !user) {
                        isLogined();
                    } else {
                        var sRouter = "main.suggestion";
                        $rootScope.$emit("menustateChange", { value: null, HeadNew: false });


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

                //导出数据统计
                $scope.exportchart = function () {
                    if (!authID || !user) {
                        isLogined();
                    } else {
                        var url = baseUrl + "/Lawstandard/downHomeChart";

                        url = http.wrapUrl(url);
                        var exportWindow = window.open(url, "_blank");
                        exportWindow.document.title = "数据统计";
                    }
                }

                //发布留言
                $scope.pubsuggest = function () {
                    if (!authID || !user) {
                        isLogined();
                    } else {
                        if (!$scope.userSuggestion.title) {
                            toaster.pop({ type: 'danger', body: '请填写标题！',timeout:0 });
                            return;

                        }
                        if (!$scope.userSuggestion.details) {
                            toaster.pop({ type: 'danger', body: '请填写内容！',timeout:0 });
                            return;

                        }
                        var requestData = angular.copy($scope.userSuggestion);
                        //不传录入时间到服务端
                        delete requestData.inputdate;
                        usercenterService.SaveOrUpdateSuggestion(requestData, function (params) {
                            if (params == 200) {
                                toaster.pop({ type: 'success', body: '发布成功！',timeout:0 });
                                $scope.selectSuggestion();
                                $scope.userSuggestion.title = "";
                                $scope.userSuggestion.details = "";
                            } else {
                                toaster.pop({ type: 'danger', body: '发布失败！',timeout:0 });
                            }
                        })
                    }
                }



                //是否登陆
                function isLogined() {
                    var url = 'partials/system/modals/login.html';
                    var modalInstance = $uibModal.open({

                        templateUrl: url,
                        controller: 'login-controller',
                        size: 'sm',
                        backdrop: 'static',
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