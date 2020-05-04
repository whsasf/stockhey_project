document.getElementById('nav-index').className = 'active';

$(function () {
    $.ajax({
        url: "https://v2.stockhey.com/static/file/allrank.json",
        type: "GET",
        cache: false,
        beforeSend: function () {
                $("#loading").show();
            },
            success: function (data) {
                var date_range = data['real_date_range'];
                var real_data = data['stock_value_data'];
                var percentDataUp = data['percent_data_up'];
                var percentDataDown = data['percent_data_down'];
                var legendSelected = '市值榜'
                var sorted_data = {};
                var CopList_dict = {};
                var PercentListDictUp = {};
                var PercentListDictDown = {};

                // get sorted_data and CopList_dict
                for (var indexx in data['stock_value_data']) {
                    // console.log(indexx)
                    sorted_data[indexx] = []
                    CopList_dict[indexx] = []
                    var ii = 0
                    for (var xxx in data['stock_value_data'][indexx]) {
                        // console.log(xxx)
                        if (ii < 5) {
                            sorted_data[indexx].push(data['stock_value_data'][indexx][xxx])
                            CopList_dict[indexx].push(data['stock_value_data'][indexx][xxx]['name'])
                            ii = ii + 1
                        } else {
                            CopList_dict[indexx].push(data['stock_value_data'][indexx][xxx]['name'])
                        }
                    }
                }
                // get PercentListDictUp and PercentListDictDown
                for (var indeyy in data['percent_data_up']) {
                    PercentListDictUp[indeyy] = []
                    for (var xxxx in data['percent_data_up'][indeyy]) {
                        PercentListDictUp[indeyy].push(data['percent_data_up'][indeyy][xxxx]['name'])
                    }
                }

                for (var indezz in data['percent_data_down']) {
                    PercentListDictDown[indezz] = []
                    for (var xxxxx in data['percent_data_down'][indezz]) {
                        PercentListDictDown[indezz].push(data['percent_data_down'][indezz][xxxxx]['name'])
                    }
                }

                // console.log(CopList_dict,date_range,real_data,sorted_data)
                myecharts(CopList_dict, date_range, real_data, sorted_data, percentDataUp, percentDataDown, PercentListDictUp, PercentListDictDown, legendSelected)
            },
            complete: function () {
                $("#loading").hide();
            },
            error: function (e) {
                console.log(e);
            }
    });
});

function myecharts(copList_dictx, real_date_rangex, all_datax, all_data_top5x, pupx, pdownx, PDictUpx, PDictDownx, legendSelectedmx) {
    var my_echart = '';
    var legendSelectedx = legendSelectedmx
    var dom = document.getElementById("container");
    my_echart = echarts.init(dom);
    my_echart.on('legendselectchanged', function (params) {
        // console.log(params.name)
        if (legendSelectedx !== params.name) {
            legendSelectedx = params.name
            render_echarts(my_echart,copList_dictx, real_date_rangex, all_datax, all_data_top5x, pupx, pdownx, PDictUpx, PDictDownx, legendSelectedx)
                // console.log(self.option.baseOption.legend)
        }
    });
    render_echarts(my_echart,copList_dictx, real_date_rangex, all_datax, all_data_top5x, pupx, pdownx, PDictUpx, PDictDownx, legendSelectedmx);
    function render_echarts(my_echartx,copList_dict, real_date_range, all_data, all_data_top5, pup, pdown, PDictUp, PDictDown, legendSelectedy) {
        var legendSelected = legendSelectedy
        var my_echartx = my_echartx
        // console.log(my_echartx)
        var option = null;
        var dataMap = {};
        var CopList_dict = copList_dict
        var date_range = real_date_range
        real_data = all_data
        dataMap.dataValue = real_data;
        sorted_data = all_data_top5

        function get_options() {
            var MyOptionsValue = []
            var MyOptionsPercentUp = []
            var MyOptionsPercentDown = []
            for (var i = 0; i < date_range.length; i++) {
                date = date_range[i];
                MyOptionsValue.push({
                    title: {
                        text: date + '日 (中美)上市公司市值30强(亿元/人民币)'
                    },
                    series: [{
                        data: dataMap.dataValue[date],
                        legend: {
                            selected: {
                                '市值榜': true,
                                '涨幅榜': false,
                                '跌幅榜': false
                            }
                        },
                        markPoint: {
                            //symbolSize: 80,
                            itemStyle: {
                                "color": '#293B55',
                            },
                            data: [{
                                symbolSize: 80,
                                name: 'NO.1',
                                value: sorted_data[date][0]['name'] + '\n1',
                                xAxis: sorted_data[date][0]['name'],
                                yAxis: sorted_data[date][0]['value']
                            }, {
                                symbolSize: 70,
                                name: 'NO.2',
                                value: sorted_data[date][1]['name'] + '\n2',
                                xAxis: sorted_data[date][1]['name'],
                                yAxis: sorted_data[date][1]['value']
                            }, {
                                symbolSize: 60,
                                name: 'NO.3',
                                value: sorted_data[date][2]['name'] + '\n3',
                                xAxis: sorted_data[date][2]['name'],
                                yAxis: sorted_data[date][2]['value']
                            }, {
                                symbolSize: 50,
                                name: 'NO.4',
                                value: sorted_data[date][3]['name'] + '\n4',
                                xAxis: sorted_data[date][3]['name'],
                                yAxis: sorted_data[date][3]['value']
                            }, {
                                symbolSize: 40,
                                name: 'NO.5',
                                value: sorted_data[date][4]['name'] + '\n5',
                                xAxis: sorted_data[date][4]['name'],
                                yAxis: sorted_data[date][4]['value']
                            }]
                        }
                    }],
                    xAxis: [{
                        type: 'category',
                        axisLabel: {
                            'interval': 0,
                            'rotate': -50
                        },
                        data: CopList_dict[date],
                        splitLine: {
                            show: false
                        }
                    }]
                });
                MyOptionsPercentUp.push({
                    title: {
                        text: date + '日 (中美)上市公司市值涨幅30强(%)',
                        textStyle: {
                            color: '#D53A35'
                        }
                    },
                    legend: {
                        selected: {
                            '市值榜': false,
                            '涨幅榜': true,
                            '跌幅榜': false
                        }
                    },
                    series: [{
                        data: pup[date],
                        name: '涨幅榜',
                        type: 'bar',
                        markLine: {
                            silent: false,
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        type: 'dotted', // 'solid',
                                        //  这儿设置的颜色是公共配置，如需单独配置，请在data里配置
                                        color: '#293B55'
                                    },
                                    label: {
                                        show: true,
                                        position: 'end'
                                    }
                                }
                            },
                            data: [{
                                yAxis: 1
                            }, {
                                yAxis: 3
                            }, {
                                yAxis: 5
                            }, {
                                yAxis: 10
                            }, {
                                yAxis: 50
                            }]
                        }
                    }],
                    xAxis: [{
                        type: 'category',
                        axisLabel: {
                            'interval': 0,
                            'rotate': -50
                        },
                        data: PDictUp[date],
                        splitLine: {
                            'show': false
                        }
                    }],
                    yAxis: [{
                        type: 'value',
                        name: '当日市值涨幅（%）'
                    }]
                });
                MyOptionsPercentDown.push({
                    title: {
                        text: date + '日 (中美)上市公司市值跌幅30强(%)',
                        textStyle: {
                            color: 'green'
                        }
                    },
                    legend: {
                        selected: {
                            '市值榜': false,
                            '涨幅榜': false,
                            '跌幅榜': true
                        }
                    },
                    color: 'green',
                    series: [{
                        name: '跌幅榜',
                        type: 'bar',
                        data: pdown[date],
                        markLine: {
                            silent: false,
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        type: 'dotted', // 'solid',
                                        //  这儿设置的颜色是公共配置，如需单独配置，请在data里配置
                                        color: '#293B55'
                                    },
                                    label: {
                                        show: true,
                                        position: 'end'
                                    }
                                }
                            },
                            data: [{
                                yAxis: -1
                            }, {
                                yAxis: -3
                            }, {
                                yAxis: -5
                            }, {
                                yAxis: -10
                            }, {
                                yAxis: -50
                            }]
                        }
                    }],
                    xAxis: [{
                        type: 'category',
                        axisLabel: {
                            'interval': 0,
                            'rotate': -50
                        },
                        data: PDictDown[date],
                        splitLine: {
                            'show': false
                        }
                    }],
                    yAxis: [{
                        type: 'value',
                        name: '当日市值跌幅（%）'
                    }]
                })

                //console.log(MyOptionsValue)
            }

            if (legendSelected === '市值榜') {
                // console.log('市值榜')
                return (MyOptionsValue)
            } else if (legendSelected === '涨幅榜') {
                // console.log('涨幅榜')
                return (MyOptionsPercentUp)
            } else {
                // console.log('跌幅榜')
                return (MyOptionsPercentDown)
            }

        }

        option = {
            baseOption: {
                timeline: {
                    // y: 0,
                    axisType: 'category',
                    // realtime: false,
                    // loop: false,
                    autoPlay: true,
                    // currentIndex: 2,
                    playInterval: 5000,
                    left: "5%",
                    right: "8%",
                    //controlStyle: {
                    //     position: 'bottom'
                    // },
                    data: date_range,
                    label: {
                        formatter: function (s) {
                            return (s); //(new Date(s)).getFullYear();
                        }
                    }
                },
                title: {
                    subtext: '数据来自互联网',
                    left: '1%',
                },
                tooltip: {

                },
                toolbox: {
                    show: true,
                    orient: "vertical",
                    right: "2%",
                    top: "25%",
                    feature: {
                        dataView: {
                            readOnly: false
                        },
                        magicType: {
                            type: ['bar', 'line']
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                color: ['#D53A35', '#D53A35', 'green'],
                legend: {
                    x: '50%',
                    data: ['市值榜', '涨幅榜', '跌幅榜'],
                    itemWidth: 35,
                    itemHeight: 25,
                    textStyle: {
                        fontSize: 16
                    },
                    selectedMode: 'single',
                    selected: {
                    }
                },
                calculable: true,
                grid: {
                    top: 80,
                    bottom: 150,
                    left: "5.5%",

                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
                            label: {
                                show: true,
                                formatter: function (params) {
                                    return params.value; //.replace('\n', '');
                                }
                            }
                        }
                    }
                },
                xAxis: [{
                }],
                yAxis: [
                    {
                    }
                ],
                series: [{
                    name: '市值榜',
                    type: 'bar'
                }, {
                    name: '涨幅榜',
                    type: 'bar'
                }, {
                    name: '跌幅榜',
                    type: 'bar'
                }]
            },
            options: get_options(),
        };
        if (option && typeof option === "object") {
            //console.log(option)
            my_echartx.setOption(option, true);
        }
    }
}
