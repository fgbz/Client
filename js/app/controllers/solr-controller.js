define(['bootstrap/app', 'utils', 'services/regulation-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('solr-controller', ['$stateParams', '$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'regulation-service',
        function ($stateParams, $rootScope, $scope, $state, toaster, $uibModal, regulationService) {

            var postData = $stateParams.data;

            var user = sessionStorage.getItem('loginUser');

            if (user) {
                user = JSON.parse(user);
            }


            $scope.pager = {
                size: 10,
                current: 1
            }

            //变量
            var define_variable = function () {
                var dics = JSON.parse(localStorage.getItem('DicItems'));


                $scope.StateList = dics.State;
            };

            //加载
            var initialize = function () {

                if (postData) {
                    postData = JSON.parse(postData);
                }
                $scope.solrText = postData.text;


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
                })

                //重置
                $scope.reset = function () {
                    $scope.Number = "";
                    $scope.Title = "";
                    $scope.FiledTimeStart = "";
                    $scope.FiledTimeEnd = "";
                    $scope.State = "";
                    $scope.KeyWordsSingle = "";
                    $scope.clickTreeValue = "";
                    $scope.EnglishTitle = "";
                    $scope.Summaryinfo = "";
                }

                //查询
                $scope.searchinfo = function (isPaging) {

                    $scope.isLoaded = false;

                    //通过当前高度计算每页个数
                    var pagesize = parseInt((window.innerHeight - 400) / 140);

                    if (!isPaging) {
                        $scope.pager.current = 1;
                    }

                    $scope.pager.size = pagesize;

                    var options = {
                        pageNo: $scope.pager.current,
                        pageSize: $scope.pager.size,
                        conditions: []
                    };
                    if ($scope.Number) {
                        options.conditions.push({ key: 'Number', value: $scope.Number });
                    }
                    if ($scope.Title) {
                        options.conditions.push({ key: 'Title', value: $scope.Title });
                    }
                    if ($scope.FiledTimeStart) {
                        options.conditions.push({ key: 'FiledTimeStart', value: $scope.FiledTimeStart });
                    }
                    if ($scope.FiledTimeEnd) {
                        options.conditions.push({ key: 'FiledTimeEnd', value: $scope.FiledTimeEnd });
                    }
                    if ($scope.State) {
                        options.conditions.push({ key: 'State', value: $scope.State });
                    }
                    if ($scope.KeyWordsSingle) {
                        options.conditions.push({ key: 'KeyWordsSingle', value: $scope.KeyWordsSingle });
                    }
                    if ($scope.clickTreeValue) {
                        options.conditions.push({ key: 'TreeValue', value: $scope.clickTreeValue });
                    }
                    if ($scope.solrText) {
                        options.conditions.push({ key: 'Solr', value: $scope.solrText});
                    }
                    if ($scope.EnglishTitle) {
                        options.conditions.push({ key: 'EnglishTitle', value: $scope.EnglishTitle });
                    }
                    if ($scope.Summaryinfo) {
                        options.conditions.push({ key: 'Summaryinfo', value: $scope.Summaryinfo });
                    }

                    var startTime = new Date();
                    regulationService.getLawstandardList(options, function (response) {
                        var endime = new Date();
                        $scope.time=parseInt(endime - startTime) / 1000;//两个时间相差的秒数
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




            };

            // 实际运行……
            define_variable();

            initialize();

            define_function();


        }]);
});