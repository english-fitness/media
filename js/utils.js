//searchBoxHandler
var SearchBox = {
    bindSearchEvent: function(searchBox, searchFunction, searchCallback){
        //lazy mode ._.
        if (!(searchBox instanceof jQuery)){
            searchBox = $(searchBox);
        }
        searchBox.keyup(function(){
            var keyword =  $(this).val();
            if(keyword.length<=3 && keyword.length>0) {
                searchFunction.call(undefined, keyword, searchCallback);
            }
        });
    },
    autocomplete: function(datasource){
        /*
        datasource:
        - searchBox
        - results
        - resultDisplay
        - itemIdProperty
        - selectCallback
        */
        var searchBox = datasource.searchBox;
        if (!(searchBox instanceof jQuery)){
            searchBox = $(searchBox);
        }
        var itemIdProperty = datasource.itemIdProperty;
        if (itemIdProperty == undefined || itemIdProperty == null || itemIdProperty == ''){
            itemIdProperty = 'id';
        }
        var autocompleteDatasource = {
            source: formatSearchResult(datasource.results, itemIdProperty, datasource.resultDisplay),
            height:'50',
        }
        if (datasource.selectCallback){
            autocompleteDatasource.select = function(e, ui){
                datasource.selectCallback.call(undefined, ui.item.id);
            };
        }
        $(searchBox).autocomplete(autocompleteDatasource);
    },
}

function formatSearchResult(results, idProperty, displayData){
	var formattedData = [];
	results.forEach(function(value,key){
		formattedData[formattedData.length] = {
            'id': value[idProperty],
			'value': value[displayData], //should be able to use more flexible expression
		}
	});
	return formattedData;
}

//ajax calls
//these ajax calls repeat a lot of times so we put it here
var AjaxCall = {
    searchStudent: function(keyword, callback){
        $.ajax({
            url:"/user/ajaxSearch",
            type:"get",
            data:{
                keyword:keyword,
                role:"role_student",
            },
            success: function(response) {
                if (callback != undefined && callback != null){
                    callback(response.results);
                }
            },
            error:function(){
                return false;
            }
        });
    },
    searchTeacher: function(keyword, callback){
		$.ajax({
			url:"/user/ajaxSearch",
			type:'get',
            data:{
                keyword:keyword,
                role:"role_teacher",
            },
			success:function(response){
                if (callback != undefined && callback != null){
                    callback(response.results);
                }
			},
            error:function(){
                return false;
            }
		});
	},
    searchUser:function(keyword, callback){
        $.ajax({
			url:"/user/ajaxSearch",
			type:'get',
            data:{
                keyword:keyword,
            },
			success:function(response){
                if (callback != undefined && callback != null){
                    callback(response.results);
                }
			},
            error:function(){
                return false;
            }
		});
    }
}
