define(['bootstrap/app', 'utils', 'services/accessory-service', 'services/region-service', 'services/organization-manager-service', 'app/config-manager', 'services/enum-service'], function (app, utils) {
    'use strict';

    var config = require('app/config-manager');
    var baseUrl = config.baseUrl();
    app.controller('userCenter-index-controller', ['$rootScope', '$scope', '$state', 'toaster', '$uibModal',
        function ($rootScope, $scope, $state, toaster, $uibModal, datamanagerService) {

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

                $scope.tableRow = {
                    selected: 0
                }

                $scope.pagerDeal = {
                    size: 10,
                    current: 1
                }

            };

            //加载
            var initialize = function () {

                $scope.isLoaded = true;

                $scope.MenuItmes = [
                    { Name: "修改密码" }, { Name: "收藏夹" }, { Name: "收藏夹管理" },
                ]


                var user = localStorage.getItem("loginUser");

                if (user) {
                    user = JSON.parse(user);

                    //权限重置
                    var check = utils.getListItem('法规审核', 'menuname', user.menus);
                    var manage = utils.getListItem('通知管理', 'menuname', user.menus);

                    if (check) {
                        $scope.MenuItmes.push({ Name: "待办箱" });
                    }
                    if (manage) {
                        $scope.MenuItmes.push({ Name: "通知管理" });
                    }
                }

                $scope.clickMenuValue = "修改密码";

                //右侧树
                $scope.treeData = [

                    { Id: '01', Name: '法律标准', ParentID: null },

                    { Id: '11', Name: '国家行政文件', ParentID: '01' },
                    { Id: '111', Name: '国家法律', ParentID: '11' },
                    { Id: '112', Name: '国务院法律', ParentID: '11' },
                    { Id: '113', Name: 'HAF', ParentID: '11' },
                    { Id: '114', Name: 'HAD', ParentID: '11' },

                    { Id: '12', Name: '国家标准', ParentID: '01' },

                    { Id: '121', Name: '国家标准', ParentID: '12' },
                    { Id: '122', Name: '能源局标准', ParentID: '12' },
                    { Id: '123', Name: '核行业标准', ParentID: '12' },
                    { Id: '124', Name: '电力行业标准', ParentID: '12' },

                    { Id: '13', Name: '国际公约及标准', ParentID: '01' },
                    { Id: '131', Name: '国际公约', ParentID: '13' },
                    { Id: '132', Name: 'ASTM', ParentID: '13' },
                    { Id: '133', Name: 'ASTM', ParentID: '13' },
                    { Id: '134', Name: '国际标准', ParentID: '13' }

                ];

                $scope.CollectItems = [
                    { Title: "中华人民共和国劳动合同法", CollectionDate: "2014-12-09" },
                    { Title: "中华人民共和国特种设备安全法", CollectionDate: "2014-12-09" },
                    { Title: "中华人民共和国环境保护法", CollectionDate: "2016-08-21" },
                    { Title: "中华人民共和国安全生产法", CollectionDate: "2014-11-19" },
                    { Title: "中华人民共和国职业病防治法", CollectionDate: "2013-05-05" },
                    { Title: "中华人民共和国劳动法", CollectionDate: "2015-11-19" },
                    { Title: "中华人民共和国劳动合同法", CollectionDate: "2014-06-12" },
                    { Title: "中华人民共和国安全生产法", CollectionDate: "2014-06-12" },
                    { Title: "中华人民共和国预算法", CollectionDate: "2014-06-12" },
                    { Title: "中华人民共和国环境保护法", CollectionDate: "2014-06-12" }
                ]

                $scope.DealItems = [
                    { Title: "中华人民共和国劳动合同法", Number: "第三十七号", PeopleName: "幸德瑞" },
                    { Title: "中华人民共和国特种设备安全法", Number: "第四条", PeopleName: "白雪" },
                    { Title: "中华人民共和国环境保护法", Number: "12-8", PeopleName: "张小刀" },
                    { Title: "中华人民共和国安全生产法", Number: "第52号", PeopleName: "张磊" },
                    { Title: "中华人民共和国职业病防治法", Number: "第五十条", PeopleName: "展会" },
                    { Title: "中华人民共和国劳动法", Number: "第69条", PeopleName: "王伟" },
                    { Title: "中华人民共和国预算法", Number: "第28号", PeopleName: "李丽" },
                    { Title: "中华人民共和国劳动合同法", Number: "12", PeopleName: "张磊" },
                    { Title: "中华人民共和国环境保护法", Number: "第三十七号", PeopleName: "谭霞" },
                    { Title: "中华人民共和国劳动合同法", Number: "第五十条", PeopleName: "白雪" }
                ]

                $scope.pager.total = 10;
                $scope.pagerDeal.total = 10;
            };

            //方法
            var define_function = function () {

                $scope.clickMenu = function (params) {
                    $scope.clickMenuValue = params.Name;
                }

                $scope.clickTable = function (params) {
                    $scope.tableRow.selected = params;
                }

                $scope.clickTree = function (params) {
                    $scope.clickTreeValue = params;
                }

            };

            // 实际运行……
            define_variable();

            initialize();

            define_function();


        }]);
});