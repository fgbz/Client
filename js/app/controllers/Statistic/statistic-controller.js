define(['bootstrap/app', 'utils', 'services/enum-service', 'services/usercenter-service', 'services/regulation-service', 'services/md5-service', 'services/system-service', 'services/technical-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('statistic-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'usercenter-service', 'ngDialog', 'regulation-service', '$stateParams', 'md5-service', '$cookies', 'system-service', 'http-service', 'technical-service',
        function ($rootScope, $scope, $state, toaster, $uibModal, usercenterService, ngDialog, regulationService, $stateParams, md5Service, $cookies, systemService, http, technicalService) {

            var user = sessionStorage.getItem('loginUser');

            if (user) {
                user = JSON.parse(user);
            }
            //变量
            var define_variable = function () {
                $scope.clickValue = "law";
            };

            //加载
            var initialize = function () {

                $scope.data = {};

                $scope.MenuItmes = [
                    { Name: "按上传部门统计" }, { Name: "按上传人统计" }, { Name: "按上传分类统计" },
                ];

                $scope.clickMenuValue = "按上传部门统计";

                var dics = JSON.parse(localStorage.getItem('DicItems'));

                $scope.PublishList = dics.Pub;

                $scope.localLang = {
                    selectAll: "全选",
                    selectNone: "全不选",
                    reset: "清空",
                    search: "请输入条件筛选...",
                    nothingSelected: "全部"
                };

                $scope.userList = angular.copy(user.userListWithOutAdmin);


                //分类
                regulationService.SelectLawstandardType(function (params) {
                    $scope.treeData = [];
                    for (var i = 0; i < params.length; i++) {
                        var data = {
                            Id: params[i].id,
                            Name: params[i].typename,
                            ParentID: params[i].parentid
                        }

                        $scope.treeData.push(data);
                    }
                    $scope.treeDataPub = angular.copy($scope.treeData);
                    $scope.treeDataPeo = angular.copy($scope.treeData);
                    $scope.treeDataType = angular.copy($scope.treeData);

                });


                //树
                technicalService.SelectTechnicalType(function (params) {
                    $scope.treeDataTec = [];

                    for (var i = 0; i < params.length; i++) {
                        var data = {
                            Id: params[i].id,
                            Name: params[i].typename,
                            ParentID: params[i].parentid
                        }
                        $scope.treeDataTec.push(data);

                    }
                });

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
                    })
                };
                $scope.initOrg();

                $scope.initChart = function (data, title) {

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
                            },
                            colors: ['#b7dffa']
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


                $scope.$watch('data.organizationPeople', function (newValue, oldValue) {
                    if (newValue) {

                        systemService.grtUserListByOrgId(newValue, function (res) {
                            $scope.userList = res.UserListWithOutAdmin;
                            $scope.data.Userid = "";
                            for (var i = 0; i < $scope.userList.length; i++) {
                                $scope.userList[i].Selected = false;
                            }
                        })
                    } else {
                        $scope.userList = angular.copy(user.userListWithOutAdmin);
                    }
                });

                $scope.$watch('data.Userid', function (newValue, oldValue) {
                    if (newValue) {
                        $scope.data.peopleTips = "";
                        for (var i = 0; i < $scope.data.Userid.length; i++) {
                            for (var j = 0; j < $scope.userList.length; j++) {
                                if ($scope.data.Userid[i].id == $scope.userList[j].id) {
                                    $scope.data.peopleTips += $scope.userList[j].userrealname + ",";
                                    break;
                                }
                            }
                        }

                    } else {
                        $scope.data.peopleTips = "";
                    }
                });



                $scope.clickType = function (params) {
                    $scope.clickValue = params;
                    changeType();

                }

                $scope.clickMenu = function (params) {
                    $scope.clickMenuValue = params.Name;
                    changeType();

                }

                var changeType = function () {
                    switch ($scope.clickMenuValue) {
                        case '按上传部门统计':
                            if ($scope.clickValue == "law") {
                                if (!$scope.lawOrgItems) {
                                    $scope.searchinfo();
                                }
                            } else {
                                if (!$scope.tecOrgItems) {
                                    $scope.searchinfo();
                                }
                            }

                            break;
                        case '按上传人统计':
                            if ($scope.clickValue == "law") {
                                if (!$scope.lawPeopleItems) {
                                    $scope.searchinfo();
                                }
                            } else {
                                if (!$scope.tecPeopleItems) {
                                    $scope.searchinfo();
                                }
                            }
                            break;
                        case '按上传分类统计':
                            if ($scope.clickValue == "law") {
                                if (!$scope.lawTypeItems) {
                                    $scope.searchinfo();
                                }
                            } else {
                                if (!$scope.tecTypeItems) {
                                    $scope.searchinfo();
                                }
                            }

                            break;

                        default:
                            break;
                    }
                }

                //重置
                $scope.reset = function () {
                    switch ($scope.clickMenuValue) {
                        case '按上传部门统计':
                            $scope.data.organizationPub = "";
                            $scope.data.FiledTimeStartPub = "";
                            $scope.data.FiledTimeEndPub = "";
                            if ($scope.clickValue == 'law') {
                                $scope.data.TreeValuePub = "";
                                // for (var i = 0; i < $scope.treeDataPub.length; i++) {
                                //     $scope.treeDataPub[i].Selected = false;
                                // }
                            } else {
                                $scope.data.TreeValuePubTec = "";
                            }

                            break;
                        case '按上传人统计':
                            $scope.data.organizationPeople = "";
                            $scope.data.Userid = "";

                            $scope.data.FiledTimeStartPeople = "";
                            $scope.data.FiledTimeEndPeople = "";

                            if ($scope.clickValue == 'law') {
                                $scope.data.TreeValuePeople = "";
                                // for (var i = 0; i < $scope.treeDataPeo.length; i++) {
                                //     $scope.treeDataPeo[i].Selected = false;
                                // }
                            } else {
                                $scope.data.TreeValuePeopleTec = "";
                            }

                            for (var i = 0; i < $scope.userList.length; i++) {
                                $scope.userList[i].Selected = false;
                            }

                            break;
                        case '按上传分类统计':
                            $scope.data.organizationType = "";

                            $scope.data.FiledTimeStartType = "";
                            $scope.data.FiledTimeEndType = "";

                            if ($scope.clickValue == 'law') {
                                $scope.data.TreeValueType = "";
                                // for (var i = 0; i < $scope.treeDataType.length; i++) {
                                //     $scope.treeDataType[i].Selected = false;
                                // }
                            } else {
                                $scope.data.TreeValueTypeTec = "";
                            }
                            break;

                        default:
                            break;
                    }
                };

                //查询
                $scope.searchinfo = function () {

                    $scope.loading = true;

                    switch ($scope.clickMenuValue) {
                        case '按上传部门统计':
                            var options = {
                                conditions: []
                            };

                            if ($scope.data.organizationPub) {
                                options.conditions.push({ key: 'Organization', value: $scope.data.organizationPub });
                            }
                            if ($scope.data.FiledTimeStartPub) {
                                options.conditions.push({ key: 'FiledTimeStart', value: $scope.data.FiledTimeStartPub });
                            }
                            if ($scope.data.FiledTimeEndPub) {
                                options.conditions.push({ key: 'FiledTimeEnd', value: $scope.data.FiledTimeEndPub });
                            }

                            if ($scope.clickValue == 'law') {
                                if ($scope.data.TreeValuePub) {
                                    options.conditions.push({ key: 'TreeValue', value: $scope.data.TreeValuePub });
                                }
                            } else {
                                if ($scope.data.TreeValuePubTec) {
                                    options.conditions.push({ key: 'TreeValue', value: $scope.data.TreeValuePubTec });
                                }
                            }


                            regulationService.getChartStatistic(options, 'pub', $scope.clickValue, function (res) {

                                if ($scope.clickValue == 'law') {
                                    if ($scope.data.organizationPub && (!res || res.length == 0)) {
                                        for (var i = 0; i < $scope.treeDataOrg.length; i++) {
                                            if ($scope.treeDataOrg[i].Id == $scope.data.organizationPub) {
                                                res.push({
                                                    name: $scope.treeDataOrg[i].Name,
                                                    count: 0
                                                });
                                            }
                                        }
                                    }
                                    $scope.OrgnameChart = $scope.initChart(res, "按上传部门统计（TOP10）");
                                    $scope.lawOrgItems = angular.copy(res);

                                } else {
                                    $scope.OrgnameChartTec = $scope.initChart(res);
                                    $scope.tecOrgItems = angular.copy(res);
                                }

                                $scope.loading = false;
                            })
                            break;
                        case '按上传人统计':
                            var options = {
                                conditions: []
                            };

                            if ($scope.data.organizationPeople) {
                                options.conditions.push({ key: 'Organization', value: $scope.data.organizationPeople });
                            }
                            if ($scope.data.FiledTimeStartPeople) {
                                options.conditions.push({ key: 'FiledTimeStart', value: $scope.data.FiledTimeStartPeople });
                            }
                            if ($scope.data.FiledTimeEndPeople) {
                                options.conditions.push({ key: 'FiledTimeEnd', value: $scope.data.FiledTimeEndPeople });
                            }

                            if ($scope.clickValue == 'law') {
                                if ($scope.data.TreeValuePeople) {
                                    options.conditions.push({ key: 'TreeValue', value: $scope.data.TreeValuePeople });
                                }
                            } else {
                                if ($scope.data.TreeValuePeopleTec) {
                                    options.conditions.push({ key: 'TreeValue', value: $scope.data.TreeValuePeopleTec });
                                }
                            }


                            if ($scope.data.Userid && $scope.data.Userid.length > 0) {

                                var str = "";
                                for (var i = 0; i < $scope.data.Userid.length; i++) {
                                    str += $scope.data.Userid[i].id + ",";
                                }
                                str = str.substring(0, str.length - 1);
                                options.conditions.push({ key: 'Userid', value: str });
                            }

                            regulationService.getChartStatistic(options, 'people', $scope.clickValue, function (res) {
                                if ($scope.clickValue == 'law') {
                                    $scope.PeopleChart = $scope.initChart(res, "按上传人统计（TOP10）");
                                    $scope.lawPeopleItems = angular.copy(res);
                                } else {
                                    $scope.PeopleChartTec = $scope.initChart(res);
                                    $scope.tecPeopleItems = angular.copy(res);
                                }


                                $scope.loading = false;
                            })
                            break;
                        case '按上传分类统计':
                            var options = {
                                conditions: []
                            };

                            if ($scope.data.organizationType) {
                                options.conditions.push({ key: 'Organization', value: $scope.data.organizationType });
                            }
                            if ($scope.data.FiledTimeStartType) {
                                options.conditions.push({ key: 'FiledTimeStart', value: $scope.data.FiledTimeStartType });
                            }
                            if ($scope.data.FiledTimeEndType) {
                                options.conditions.push({ key: 'FiledTimeEnd', value: $scope.data.FiledTimeEndType });
                            }

                            if ($scope.clickValue == 'law') {
                                if ($scope.data.TreeValueType) {
                                    options.conditions.push({ key: 'TreeValue', value: $scope.data.TreeValueType });
                                }
                            } else {
                                if ($scope.data.TreeValueTypeTec) {
                                    options.conditions.push({ key: 'TreeValue', value: $scope.data.TreeValueTypeTec });
                                }
                            }


                            regulationService.getChartStatistic(options, 'type', $scope.clickValue, function (res) {

                                if ($scope.clickValue == 'law') {
                                    if ($scope.data.TreeValueType && (!res || res.length == 0)) {
                                        for (var i = 0; i < $scope.treeDataPub.length; i++) {
                                            if ($scope.treeDataPub[i].Id == $scope.data.TreeValueType) {
                                                res.push({
                                                    name: $scope.treeDataPub[i].Name,
                                                    count: 0
                                                });
                                            }
                                        }
                                    }


                                    $scope.TypeChart = $scope.initChart(res, "按上传分类统计（TOP10）");
                                    $scope.lawTypeItems = angular.copy(res);
                                } else {
                                    $scope.TypeChartTec = $scope.initChart(res);
                                    $scope.tecTypeItems = angular.copy(res);
                                }


                                $scope.loading = false;
                            })
                            break;

                        default:
                            break;
                    }
                }

                $scope.searchinfo();

                //导出
                $scope.exportData = function () {
                    var url = '';
                    switch ($scope.clickMenuValue) {
                        case '按上传部门统计':

                            var pub = $scope.data.organizationPub ? $scope.data.organizationPub : null;
                            var starttime = $scope.data.FiledTimeStartPub ? $scope.data.FiledTimeStartPub : null;
                            var endtime = $scope.data.FiledTimeEndPub ? $scope.data.FiledTimeEndPub : null;
                            var treevalue = "";

                            if ($scope.clickValue == 'law') {
                                treevalue = $scope.data.TreeValuePub ? $scope.data.TreeValuePub : null;
                            } else {
                                treevalue = $scope.data.TreeValuePubTec ? $scope.data.TreeValuePubTec : null;
                            }

                            url = baseUrl + "/Lawstandard/downStatistic?Organization=" + pub + "&FiledTimeStart=" + starttime + "&FiledTimeEnd=" + endtime + "&TreeValue=" + treevalue + "&type=" + "pub" + "&clickvalue=" + $scope.clickValue;

                            url = http.wrapUrl(url);

                            break;
                        case '按上传人统计':

                            var pub = $scope.data.organizationPeople ? $scope.data.organizationPeople : null;
                            var starttime = $scope.data.FiledTimeStartPeople ? $scope.data.FiledTimeStartPeople : null;
                            var endtime = $scope.data.FiledTimeEndPeople ? $scope.data.FiledTimeEndPeople : null;
                            var treevalue = "";
                            if ($scope.clickValue == 'law') {
                                treevalue = $scope.data.TreeValuePeople ? $scope.data.TreeValuePeople : null;
                            } else {
                                treevalue = $scope.data.TreeValuePeopleTec ? $scope.data.TreeValuePeopleTec : null;
                            }

                            var userid = null;
                            if ($scope.data.Userid && $scope.data.Userid.length > 0) {

                                var str = "";
                                for (var i = 0; i < $scope.data.Userid.length; i++) {
                                    str += $scope.data.Userid[i].id + ",";
                                }
                                str = str.substring(0, str.length - 1);
                                userid = str;
                            }

                            url = baseUrl + "/Lawstandard/downStatistic?Organization=" + pub + "&FiledTimeStart=" + starttime + "&FiledTimeEnd=" + endtime + "&TreeValue=" + treevalue + "&Userid=" + userid + "&type=" + "people" + "&clickvalue=" + $scope.clickValue;

                            url = http.wrapUrl(url);
                            break;
                        case '按上传分类统计':

                            var pub = $scope.data.organizationType ? $scope.data.organizationType : null;
                            var starttime = $scope.data.FiledTimeStartType ? $scope.data.FiledTimeStartType : null;
                            var endtime = $scope.data.FiledTimeEndType ? $scope.data.FiledTimeEndType : null;
                            var treevalue = "";
                            if ($scope.clickValue == 'law') {
                                treevalue = $scope.data.TreeValueType ? $scope.data.TreeValueType : null;
                            } else {
                                treevalue = $scope.data.TreeValueTypeTec ? $scope.data.TreeValueTypeTec : null;
                            }


                            url = baseUrl + "/Lawstandard/downStatistic?Organization=" + pub + "&FiledTimeStart=" + starttime + "&FiledTimeEnd=" + endtime + "&TreeValue=" + treevalue + "&type=" + "type" + "&clickvalue=" + $scope.clickValue;

                            url = http.wrapUrl(url);
                            break;

                        default:
                            break;
                    }

                    var exportWindow = window.open(url, "_blank");
                    exportWindow.document.title = "统计分析";
                };

                //时间监听
                $scope.$watch('data.FiledTimeStartPub', function (newValue, oldValue) {
                    if (newValue) {
                        if ($scope.data.FiledTimeStartPub > $scope.data.FiledTimeEndPub && $scope.data.FiledTimeEndPub) {
                            toaster.pop({ type: 'danger', body: '结束时间不能早于开始时间！',timeout:5000 });
                            $scope.data.FiledTimeStartPub = oldValue;
                        }
                    }
                });
                $scope.$watch('data.FiledTimeEndPub', function (newValue, oldValue) {
                    if (newValue) {
                        if ($scope.data.FiledTimeStartPub > $scope.data.FiledTimeEndPub) {
                            toaster.pop({ type: 'danger', body: '结束时间不能早于开始时间！',timeout:5000 });
                            $scope.data.FiledTimeEndPub = oldValue;
                        }
                    }
                });

                $scope.$watch('data.FiledTimeStartPeople', function (newValue, oldValue) {
                    if (newValue) {
                        if ($scope.data.FiledTimeStartPeople > $scope.data.FiledTimeEndPeople && $scope.data.FiledTimeEndPeople) {
                            toaster.pop({ type: 'danger', body: '结束时间不能早于开始时间！' ,timeout:5000});
                            $scope.data.FiledTimeStartPeople = oldValue;
                        }
                    }
                });
                $scope.$watch('data.FiledTimeEndPeople', function (newValue, oldValue) {
                    if (newValue) {
                        if ($scope.data.FiledTimeStartPeople > $scope.data.FiledTimeEndPeople) {
                            toaster.pop({ type: 'danger', body: '结束时间不能早于开始时间！' ,timeout:5000});
                            $scope.data.FiledTimeEndPeople = oldValue;
                        }
                    }
                });

                $scope.$watch('data.FiledTimeStartType', function (newValue, oldValue) {
                    if (newValue) {
                        if ($scope.data.FiledTimeStartType > $scope.data.FiledTimeEndType && $scope.data.FiledTimeEndType) {
                            toaster.pop({ type: 'danger', body: '结束时间不能早于开始时间！' ,timeout:5000});
                            $scope.data.FiledTimeStartType = oldValue;
                        }
                    }
                });
                $scope.$watch('data.FiledTimeEndType', function (newValue, oldValue) {
                    if (newValue) {
                        if ($scope.data.FiledTimeStartType > $scope.data.FiledTimeEndType) {
                            toaster.pop({ type: 'danger', body: '结束时间不能早于开始时间！',timeout:5000 });
                            $scope.data.FiledTimeEndType = oldValue;
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