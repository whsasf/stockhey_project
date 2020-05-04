document.getElementById('nav-index').className = 'active';

$(function(){
    $.ajax({
        url: "http://192.168.1.5:8080/echart",
        type: "GET",
        success: function(data) {
            var CopList_dict =  data['CopList_dict'];
            var date_range = data['real_date_range'];
            var real_data = data['all_data'];
            var sorted_data = data['all_data_top3'];
            render_echarts(CopList_dict,date_range,real_data,sorted_data)
        },
        error:function(e) {
            console.log(e);
        }
        });   
});


    //href="http://192.168.1.5:8080/rank?page=1"

// define render_echarts function
function render_echarts (copList_dict,real_date_range,all_data,all_data_top3){
    var dom = document.getElementById("container");
    var myChart = echarts.init(dom);
    var app = {};
    var option = null;
    var dataMap = {};
    var CopList_dict =  copList_dict
    date_range = real_date_range
    real_data = all_data
    dataMap.dataValue = real_data;
    sorted_data = all_data_top3
    function get_options(){
        var my_options = [];
        for (var i=0;i <date_range.length;i++){
            date = date_range[i];
            my_options.push(
                {
                    "title":{"text": date+'中国上市公司市值50强'},
                    "series":[{
                        "data": dataMap.dataValue[date],
                        "markPoint":{
                            //symbolSize: 80,
                            "itemStyle":{
                                "color": '#293B55',
                             },
                            "data": [
                                {"symbolSize": 80,"name": 'NO.1', "value": sorted_data[date][0]['name']+'\n*我是老大*', "xAxis": sorted_data[date][0]['name'], "yAxis":sorted_data[date][0]['value']},
                                {"symbolSize": 70,"name": 'NO.2', "value": sorted_data[date][1]['name']+'\n*望穿秋水*', "xAxis": sorted_data[date][1]['name'], "yAxis":sorted_data[date][1]['value']},
                                {"symbolSize": 60,"name": 'NO.3', "value": sorted_data[date][2]['name']+'\n*保三争二*', "xAxis": sorted_data[date][2]['name'], "yAxis":sorted_data[date][2]['value']},
                            ]
            }}],
            "xAxis": [
                {
                    'type':'category',
                    'axisLabel':{'interval':0,'rotate':-50},
                    'data':CopList_dict[date],
                    "splitLine": {"show": false}
                }]}
            );
        }
        //console.log(my_options)
        return (my_options);
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
                playInterval: 2000,
                left:"5%",
                right:"8%",
                //controlStyle: {
                //     position: 'bottom'
                // },
                data: date_range,
                label: {
                    formatter : function(s) {
                        return (s);//(new Date(s)).getFullYear();
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
                    dataView: {readOnly: false},
                    magicType: {type: ['bar','line']},
                    restore: {},
                    saveAsImage: {}
                }
            },
            legend: {
                x: "90%",
                data: ['市值'],
                selected: {
                    '市值': true
                }
            },
            calculable : true,
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
                                return params.value;//.replace('\n', '');
                            }
                        }
                    }
                }
            },
            xAxis: [
                {
                    //'type':'category',
                    //'axisLabel':{'interval':0,'rotate':-60},
                    //'data':CopList_dict['2019-11-23'],
                    //splitLine: {show: false}
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '市值（亿元/人民币）'
                }
            ],
            series: [
                {
                    name: '市值', 
                    type: 'bar',
                    markLine: {
                        silent: false,
                        itemStyle: {
                            normal: { 
                                lineStyle: {
                                    type: 'dotted',//'solid',
                                    // 这儿设置的颜色是公共配置，如需单独配置，请在data里配置
                                    color: '#293B55',
                                }, 
                                label: { 
                                    show: true,
                                    position: 'end'
                                }
                            },
                        },
                        data: [{
                            yAxis: 5000,
                        }, {
                            yAxis: 15000,
                        }, {
                            yAxis: 30000,
                        }]
                }
                }
            ]
        },
        options: get_options(),
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}


