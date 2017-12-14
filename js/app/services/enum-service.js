define(['bootstrap/app'], function (app) {
    'use strict';

    app.service('enum-service', function () {
        //信访形式
        this.XFXS = [
            {
                key: '0001',
                value: '来信'
            },
            {
                key: '0002',
                value: '来电'
            },
            {
                key: '0003',
                value: '来访'
            },
            {
                key: '0004',
                value: '网上信访'
            }
        ];
        //办理状态
        this.BLZT = [
            {
                value: '已登记'
            },
            {
                value: '已交办'
            },
            {
                value: '已交办撤回'
            },
            {
                value: '已交办退回'
            },
            {
                value: '已收件'
            },
            {
                value: '已办结'
            }
        ];
        //当前节点
        this.DQJD=[
            {
                value:'申请'
            },
            {
                value:'调查'
            },
            {
                value:'审批'
            },
            {
                value:'公示'
            }
        ]
        //是否公示
        this.SFGS=[
            {
                value:'是'
            },
            {
                value:'否'
            }
        ]
        //复查状态
        this.FCZT=[
            {
                value:'已登记'
            },
            {
                value:'已交办'
            },
            {
                value:'已收件'
            },
            {
                value:'已办结'
            }
        ]
        //满意结果
        this.PJJG = [
            {
                key: '0001',
                value: '满意'
            },
            {
                key: '0002',
                value: '基本满意'
            },
            {
                key: '0003',
                value: '其他'
            },
            {
                key: '0004',
                value: '不满意'
            },
        ]
        //证件号码
        this.ZJLX = [
            {
                key: '0001',
                value: '居民身份证'
            },
            {
                key: '0002',
                value: '军官证'
            },
            {
                key: '0003',
                value: '士兵证'
            },
            {
                key: '0004',
                value: '警官证'
            },
            {
                key: '0005',
                value: '港澳台居民身份证'
            },
            {
                key: '0006',
                value: '护照'
            },
            {
                key: '0007',
                value: '户口薄'
            },
            {
                key: '0008',
                value: '其他'
            },
        ]
        //信访目的
        this.XFMD = [
            {
                key: '0001',
                value: '意见建议'
            },
            {
                key: '0002',
                value: '申诉'
            },
            {
                key: '0003',
                value: '求决'
            },
            {
                key: '0004',
                value: '揭发控告'
            },
            {
                key: '0005',
                value: '咨询'
            },
            {
                key: '0006',
                value: '其他'
            },
        ]
        //来源
        this.LY = [
            {
                key: '0001',
                value: '本级受理'
            },
            {
                key: '0002',
                value: '法院'
            },
            {
                key: '0003',
                value: '检察院'
            },
            {
                key: '0004',
                value: '监察局'
            },
            {
                key: '0005',
                value: '发改局'
            },
            {
                key: '0006',
                value: '建设局'
            },
            {
                key: '0007',
                value: '政府办'
            },
            {
                key: '0008',
                value: '国土资源部'
            },
            {
                key: '0009',
                value: '国家信访局'
            },
            {
                key: '0010',
                value: '省信访局'
            },
            {
                key: '0011',
                value: '省纪委'
            },
            {
                key: '0012',
                value: '中纪委'
            },
            {
                key: '0013',
                value: '省长信箱'
            },
            {
                key: '0014',
                value: '市信访局'
            },
            {
                key: '0015',
                value: '市长热线'
            },
            {
                key: '0016',
                value: '市纪委'
            },
            {
                key: '0017',
                value: '市人大'
            },
            {
                key: '0018',
                value: '县效能投诉中心'
            },
            {
                key: '0019',
                value: '省国土资源部'
            },
            {
                key: '0020',
                value: '网络投诉举报'
            },
            {
                key: '0021',
                value: '96178廉政投诉热线'
            },
            {
                key: '0022',
                value: '国家土地监察上海局'
            },
            {
                key: '0023',
                value: '其他'
            }
        ];

        //来信类型
        this.LXLX = [
            {
                key: '0001',
                value: '联名信'
            },
            {
                key: '0002',
                value: '越级信'
            }
        ];

        //案件特点
        this.AJTD = [
            {
                key: '0001',
                value: '发督查令'
            },
            {
                key: '0002',
                value: '领导办案'
            },
            {
                key: '0003',
                value: '摘报领导'
            },
            {
                key: '0004',
                value: '领导批示'
            },

        ];

        //来访类型
        this.LFLX = [
            {
                key: '0001',
                value: '集体访'
            },
            {
                key: '0002',
                value: '越级访'
            }
        ];

        //领导级别
        this.LDJB = [
            {
                key: '0001',
                value: '局领导'
            },
            {
                key: '0002',
                value: '市领导'
            },
            {
                key: '0003',
                value: '省领导'
            }

        ];

        //信访级别
        this.XFJB = [
            {
                key: '0004',
                value: '区县'
            },
            {
                key: '0005',
                value: '街道/镇'
            },
            {
                key: '0006',
                value: '村'
            }
        ];

        //问题性质
        this.WTXZ = [
            {
                key: '0100',
                value: '违法占地',
                children: [
                    {
                        key: '0101',
                        value: '擅自占地'
                    },
                    {
                        key: '0102',
                        value: '越权批地'
                    },
                    {
                        key: '0103',
                        value: '未批先占'
                    },
                    {
                        key: '0104',
                        value: '少批多占'
                    },
                    {
                        key: '0105',
                        value: '非法转让'
                    },
                    {
                        key: '0106',
                        value: '荒芜土地'
                    },
                    {
                        key: '0107',
                        value: '改变用途'
                    },
                    {
                        key: '0108',
                        value: '建砖瓦窑'
                    },
                    {
                        key: '0109',
                        value: '毁田取土'
                    },
                    {
                        key: '0110',
                        value: '乱批宅基'
                    },
                    {
                        key: '0111',
                        value: '土地整理'
                    },
                ]
            },
            {
                key: '0200',
                value: '征地纠纷',
                children: [
                    {
                        key: '0201',
                        value: '拒绝征用'
                    },
                    {
                        key: '0202',
                        value: '安置补偿'
                    },
                    {
                        key: '0203',
                        value: '其他征地纠纷'
                    },
                ]
            },
            {
                key: '0300',
                value: '全书争议',
                children: [
                    {
                        key: '0301',
                        value: '单位之间'
                    },
                    {
                        key: '0302',
                        value: '个人之间'
                    },
                    {
                        key: '0303',
                        value: '个人与单位之间'
                    },
                    {
                        key: '0304',
                        value: '不服裁决(判决)'
                    },
                ]
            },
            {
                key: '0400',
                value: '地矿纠纷',
                children: [
                    {
                        key: '0501',
                        value: '越界探采'
                    },
                    {
                        key: '0502',
                        value: '无证探采'
                    },
                    {
                        key: '0503',
                        value: '破坏矿产资源'
                    },
                    {
                        key: '0504',
                        value: '其他地矿纠纷'
                    },
                ]
            },
            {
                key: '0500',
                value: '揭发批评',
                children: [
                    {
                        key: '0501',
                        value: '揭发批评'
                    }
                ]
            },
            {
                key: '0600',
                value: '咨询建议',
                children: [
                    {
                        key: '0501',
                        value: '咨询建议'
                    }
                ]
            },
            {
                key: '0600',
                value: '其它',
                children: [
                    {
                        key: '0501',
                        value: '其它'
                    }
                ]
            }
        ]


    });
});