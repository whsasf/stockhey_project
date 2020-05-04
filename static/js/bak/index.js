        $(function() {
          $( "#tabs" ).tabs();
        });

        $(function(){
            var element = $('#element_add');//获得数据装配的位置
            //初始化所需数据
            var options = {
                bootstrapMajorVersion:3,//版本号。3代表的是第三版本
                currentPage: 1, //当前页数
                numberOfPages: 10, //显示页码数标个数
                totalPages:{{ total_page }}, //总共的数据所需要的总页数
                itemTexts: function (type, page, current) {  
                        //图标的更改显示可以在这里修改。
                switch (type) {  
                        case "first":  
                            return "<<";  
                        case "prev":  
                            return "<";  
                        case "next":  
                            return ">";  
                        case "last":  
                            return ">>";  
                        case "page":  
                            return  page;  
                    }                 
                }, 
                tooltipTitles: function (type, page, current) {
                    //如果想要去掉页码数字上面的预览功能，则在此操作。例如：可以直接return。
                    switch (type) {
                        case "first":
                            return "Go to first page";
                        case "prev":
                            return "Go to previous page";
                        case "next":
                            return "Go to next page";
                        case "last":
                            return "Go to last page";
                        case "page":
                            return (page === current) ? "Current page is " + page : "Go to page " + page;
                    }
                },
                onPageClicked: function (e, originalEvent, type, page) {  
                    //单击当前页码触发的事件。若需要与后台发生交互事件可在此通过ajax操作。page为目标页数。
                    //console.log(e);
                    //console.log(originalEvent);
                    //console.log(type);
                    //console.log(page)
                    $.ajax({
                        url: "http://localhost:8080/rank?page="+page,
                        type: "GET",
                        success: function(data) {
                            data_list = eval(data)
                            //console.log(data_list[0])
                            //清空之前的表格数据
                            $("#tbody").empty("");
                            tdata = '';
                            for (let i = 0; i < data_list.length; i++) {
                                index = parseInt(i)+1+(page-1)*20
                                tdata = tdata + '<tr><td>'+ index+ '</td><td>' + data_list[i][0]+ '</td><td>' + data_list[i][1] + '</td><td>' + data_list[i][2]+ '</td></tr>'
                            };
                            $("#tbody").append(tdata);
                        },
                        error:function(e) {
                            console.log(e);
                            //$("#save_goods_category_tips").html('保存商品目录失败!!').delay(3000).hide(0);
                        }
                        });
                }
            };
            element.bootstrapPaginator(options);	//进行初始化
        });