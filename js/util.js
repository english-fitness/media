var DateUtil= {
    addDay: function(date, amount, delimiter){
        if (!delimiter){
            var delimiter = '-';
        }
        if (amount == 0){
            return date.slice(0, 10).replace(/\//g, delimiter);
        }
        var denormalizedDate = date.replace(/-/g, '/');
        var result = new Date(denormalizedDate);
        result.setDate(result.getDate() + parseInt(amount));
        
        var month = (result.getMonth() + 1 < 10) ? '0' + (result.getMonth() + 1) : result.getMonth() + 1;
        var day = (result.getDate() < 10) ? '0' + (result.getDate()) : result.getDate();
        
        //normalize date format
        return result.getFullYear() + delimiter + month + delimiter + day;
    }
}

//searchBoxHandler
var SearchBox = {
    bindSearchEvent: function(searchBoxId, searchFunction){
        $("#"+searchBoxId).keyup(function(){
            var keyword =  $(this).val();
            if(keyword.length<=3 && keyword.length>0) {
                searchFunction.call(undefined, keyword);
            }
        });
    },
    autocomplete: function(searchBox, results, selectCallback){
        var searchBox = $('#'+searchBox)
        if (selectCallback){
            searchBox.autocomplete({
                source: formatSearchResult(results),
                height:'50',
                select:function(e, ui){
                    selectCallback.call(undefined, ui.item.id);
                },
            });
        } else {
            searchBox.autocomplete({
                source: formatSearchResult(results),
                height:'50',
            });
        }
    }
}

function formatSearchResult(result){
	var formattedData = [];
	result.forEach(function(value,key){
		formattedData[formattedData.length] = {
			'value': value.usernameAndFullName,
			'id': value.id,
		}
	});
	return formattedData;
}