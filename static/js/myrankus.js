document.getElementById('nav-rankus').className = 'active';

$('#table').bootstrapTable('destroy').bootstrapTable({
    url: 'static/file/rankdataus.json',
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
      field: 'stock_percent',
      title: '单日振幅(%)',
      sortable: true,
      sortOrder: "desc",
    },{
      field: 'stock_buss_alias',
      title: '行业',
      sortable: true,
      sortOrder: "asc",
    },{
      field: 'stock_area',
      title: '上市地区',
      sortable: true,
      sortOrder: "asc",
    }]
});
$("table thead tr th").ready(function(){   //*[@id="table"]/thead/tr/th[2]
	$('table thead tr th[data-field!="stock_name"]').css("background-color","#4b89bc").addClass(' col-md-1'); 
        $('table thead tr th[data-field="stock_name"]').css("background-color","#4b89bc").addClass(' col-md-2'); 
	$('table thead tr th[data-field="stock_buss_alias"]').css("background-color","#4b89bc").addClass(' col-md-2'); 
    });  


