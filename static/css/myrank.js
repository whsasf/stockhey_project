document.getElementById('nav-rank').className = 'active';

$('#table').bootstrapTable('destroy').bootstrapTable({
    url: 'static/file/rankdata.json',
    search: true,
    showLoading: true,
    sidePagination:'client',
    cache: false,
    pagination: true, 
    //showFullscreen: true,
    pageSize:50,
    pageList: [20, 50, 100,500,1000,2000],
    paginationPreText:"上一页",
    paginationNextText:"下一页",
    paginationLoop:false,
    showRefresh: true,
    showToggle: true,
    showExport: true,
    clickToSelect: true,
    columns: [{
      field: 'index',
      title: '排名',
      sortable: true,
      sortOrder: "asc",
    },{
      field: 'stock_id',
      title: '代号',
      sortable: true,
      sortOrder: "asc",
    }, {
      field: 'stock_name',
      title: '公司名称',
      sortable: true,
      sortOrder: "asc",
    },{
      field: 'stock_value',
      title: '市值(亿/人民币)',
      sortable: true,
      sortOrder: "desc",
    },{
      field: 'stock_area',
      title: '上市地区',
      sortable: true,
      sortOrder: "asc",
    }]
});
$("table thead tr th").ready(function(){   //*[@id="table"]/thead/tr/th[2]
        $("table thead tr th").addClass('warning');  
    });  


// load data 
//$(function(){
//    fetchrankdata(1);
//    //display pagenite
//    var element = $('#element_add');//获得数据装配的位置
//    //初始化所需数据
//    var options = {
//        bootstrapMajorVersion:3,//版本号。3代表的是第三版本
//        currentPage: 1, //当前页数
//        numberOfPages: 10, //显示页码数标个数
//        totalPages: total_page,//data['total_page'], //总共的数据所需要的总页数
//        itemTexts: function (type, page, current) {  
//                //图标的更改显示可以在这里修改。
//        switch (type) {  
//                case "first":  
//                    return "<<";  
//                case "prev":  
//                    return "<";  
//                case "next":  
//                    return ">";  
//                case "last":  
//                    return ">>";  
//                case "page":  
//                    return  page;  
//            }                 
//        }, 
//        tooltipTitles: function (type, page, current) {
//            //如果想要去掉页码数字上面的预览功能，则在此操作。例如：可以直接return。
//            switch (type) {
//                case "first":
//                    return "Go to first page";
//                case "prev":
//                    return "Go to previous page";
//                case "next":
//                    return "Go to next page";
//                case "last":
//                    return "Go to last page";
//                case "page":
//                    return (page === current) ? "Current page is " + page : "Go to page " + page;
//            }
//        },
//        onPageClicked: function (e, originalEvent, type, page) {  
//            //单击当前页码触发的事件。若需要与后台发生交互事件可在此通过ajax操作。page为目标页数。
//            //console.log(e);
//            //console.log(originalEvent);
//            //console.log(type);
//            //console.log(page)
//            fetchrankdata(page);
//        }
//    };
//    element.bootstrapPaginator(options);	//进行初始化
//});


//define function to fetch rankdata 
//function fetchrankdata(page){
//    $.ajax({
//        url: "http://192.168.1.5:8080/rankdata?page="+page,
//        type: "GET",
//        beforeSend: function () {
//            $("#loading").show();
//        },
//        success: function(data) {
//            //console.log(data)
//            //display table
//            $("#tbody").empty("");
//            tdata = '';
//            data_list = eval(data);
//            for (let i = 0; i < data_list.length; i++) {
//                index = parseInt(i)+1+(page-1)*20
//                tdata = tdata + '<tr><td>'+ index+ '</td><td>' + data_list[i][0]+ '</td><td>' + data_list[i][1] + '</td><td>' + data_list[i][2]+ '</td><td>' + data_list[i][3] +'</td></tr>'
//            };
//            $("#tbody").append(tdata);            
//        },
//        complete: function () {
//            $("#loading").hide();
//        },
//        error:function(e) {
//            console.log(e);
//        }
//        });   
//};


