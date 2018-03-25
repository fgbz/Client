define(['bootstrap/app', 'utils', 'services/regulation-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('solr-controller', ['$stateParams', '$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'regulation-service',
        function ($stateParams, $rootScope, $scope, $state, toaster, $uibModal, regulationService) {

            var postData = $stateParams.data;

            var user = sessionStorage.getItem('loginUser');

            var dics = JSON.parse(localStorage.getItem('DicItems'));
            if (user) {
                user = JSON.parse(user);
            }


            $scope.pager = {
                size: 10,
                current: 1
            }

            //变量
            var define_variable = function () {

                $scope.StateList = dics.State;
                $scope.searchdata = {};
            };

            //加载
            var initialize = function () {

                if (postData) {
                    postData = JSON.parse(postData);
                    //保留查询条件
                    if (postData.selectData) {
                        $scope.searchdata = postData.selectData;
                    } else {
                        $scope.searchdata.solrText = postData.text;
                    }
                }



                //树
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
                    if (postData && postData.treevalueid) {
                        $scope.clickTreeValue = postData.treevalueid;
                    }
                })

                //重置
                $scope.reset = function () {
                    $scope.searchdata.Number = "";
                    $scope.searchdata.Title = "";
                    $scope.searchdata.FiledTimeStart = "";
                    $scope.searchdata.FiledTimeEnd = "";
                    $scope.searchdata.State = "";
                    $scope.searchdata.KeyWordsSingle = "";
                    $scope.clickTreeValue = "";
                    $scope.searchdata.EnglishTitle = "";
                    $scope.searchdata.Summaryinfo = "";
                }

                //回车
                $scope.PressSolr = function (target) {
                    if (target.keyCode == 13) {
                        $scope.searchinfo();
                    }
                }

                //查询
                $scope.searchinfo = function (isPaging) {

                    if (!$scope.searchdata.solrText) {
                        return;
                    }
                    $scope.isLoaded = false;

                    //通过当前高度计算每页个数
                    var pagesize = parseInt((window.innerHeight - 400) / 140);

                    if (!isPaging) {
                        $scope.pager.current = 1;
                    }

                    $scope.pager.size = dics.PageSize;

                    var options = {
                        pageNo: $scope.pager.current,
                        pageSize: $scope.pager.size,
                        conditions: []
                    };
                    if ($scope.searchdata.Number) {
                        options.conditions.push({ key: 'Number', value: $scope.searchdata.Number });
                    }
                    if ($scope.searchdata.Title) {
                        options.conditions.push({ key: 'Title', value: $scope.searchdata.Title });
                    }
                    if ($scope.searchdata.FiledTimeStart) {
                        options.conditions.push({ key: 'FiledTimeStart', value: $scope.searchdata.FiledTimeStart });
                    }
                    if ($scope.searchdata.FiledTimeEnd) {
                        options.conditions.push({ key: 'FiledTimeEnd', value: $scope.searchdata.FiledTimeEnd });
                    }
                    if ($scope.searchdata.State) {
                        options.conditions.push({ key: 'State', value: $scope.searchdata.State });
                    }
                    if ($scope.searchdata.KeyWordsSingle) {
                        options.conditions.push({ key: 'KeyWordsSingle', value: $scope.searchdata.KeyWordsSingle });
                    }
                    if ($scope.clickTreeValue) {
                        options.conditions.push({ key: 'TreeValue', value: $scope.clickTreeValue });
                    } else if (postData && postData.treevalueid) {
                        options.conditions.push({ key: 'TreeValue', value: postData.treevalueid });
                    }
                    if ($scope.searchdata.solrText) {
                        options.conditions.push({ key: 'Solr', value: $scope.searchdata.solrText });
                    }
                    if ($scope.searchdata.EnglishTitle) {
                        options.conditions.push({ key: 'EnglishTitle', value: $scope.searchdata.EnglishTitle });
                    }
                    if ($scope.searchdata.Summaryinfo) {
                        options.conditions.push({ key: 'Summaryinfo', value: $scope.searchdata.Summaryinfo });
                    }

                    options.conditions.push({ key: 'ApproveStatus', value: 3 });

                    var startTime = new Date();
                    regulationService.getSolrList(options, function (response) {
                        var endime = new Date();
                        $scope.time = parseInt(endime - startTime) / 1000;//两个时间相差的秒数
                        $scope.isLoaded = true;
                        $scope.items = response.CurrentList;
                        $scope.pager.total = response.RecordCount;
                    })


                }

                $scope.searchinfo();

            };

            //方法
            var define_function = function () {

                $scope.goState = function () {

                    var sRouter = "main.home";
                    $state.go(sRouter);

                }

                //查看
                $scope.Check = function (item) {

                    var itemdata = {
                        id: item.id,
                        clickcount: item.clickcount
                    }

                    regulationService.AddLawstandardCount(itemdata, function () {
                        var sRouter = "main.regulationsStandardsDetail";

                        var itemDeal = {};
                        itemDeal.type = "check";
                        itemDeal.clickValue = 'solr';
                        itemDeal.item = { id: item.id };
                        itemDeal.selectData = $scope.searchdata;
                        itemDeal.treevalueid = $scope.clickTreeValue;
                        var data = JSON.stringify(itemDeal);

                        // $state.go(sRouter, { "data": data });
                        var url = $state.href(sRouter, { "data": data });
                        window.open(url, '_blank');
                    })

                };


                //时间监听
                $scope.$watch('searchdata.FiledTimeStart', function (newValue, oldValue) {
                    if (newValue) {
                        if ($scope.searchdata.FiledTimeStart > $scope.searchdata.FiledTimeEnd) {
                            toaster.pop({ type: 'danger', body: '开始时间不能大于结束时间!' });
                            $scope.searchdata.FiledTimeStart = oldValue;
                        }
                    }
                });
                $scope.$watch('searchdata.FiledTimeEnd', function (newValue, oldValue) {
                    if (newValue) {
                        if ($scope.searchdata.FiledTimeStart > $scope.searchdata.FiledTimeEnd) {
                            toaster.pop({ type: 'danger', body: '开始时间不能大于结束时间!' });
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