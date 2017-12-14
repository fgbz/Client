define(['bootstrap/app', 'utils', 'app/config-manager', 'services/main-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('notice-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal', 'main-service',
        function ($rootScope, $scope, $state, toaster, $uibModal, mainService) {



            //变量
            var define_variable = function () {

                $scope.pager = {
                    size: 10,
                    current: 1
                }
            };

            //加载
            var initialize = function () {


                var test = function () {
                    $.ajax({
                        type: "Get",
                        url: "http://api.pomesoft.com/sems-api/api/lawStandard.action",
                        data:{'m':'getPage','coopCode':'sastind','frontUserId':1,'accessToken':1},
                        dataType: "jsonp",
                        contentType: "application/json;charset=utf-8",
                        success: function (result) {
                            var test1 = result;
                        },
                        error: function (err) {
                            window.alert(err.status);

                        }

                    })
                }

                mainService.getNotices().success(function(res){
                    var te = res;
                })

                test();

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
            };

            //方法
            var define_function = function () {

                $scope.goState = function (params) {

                    var sRouter = "main.home";


                    $rootScope.$emit("menustateChange", { value: sRouter, HeadNew: true });
                    $state.go(sRouter);
                }
            };

            // 实际运行……
            define_variable();

            initialize();

            define_function();


        }]);
});