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
    search: function(searchBox, searchFunction, searchCallback){
        //lazy mode ._.
        if (!(searchBox instanceof jQuery)){
            searchBox = $(searchBox);
        }
        var keyword = searchBox.val();
        searchFunction.call(undefined, keyword, searchCallback);
    },
    autocomplete: function(datasource, search){
        /*
        datasource:
        - searchBox
        - results
        - resultValue
        - resultLabel
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
            source: formatSearchResult(datasource.results, itemIdProperty, datasource.resultValue, datasource.resultLabel),
            height:'50',
        }
        if (datasource.selectCallback){
            autocompleteDatasource.select = function(e, ui){
                datasource.selectCallback.call(undefined, ui.item.id, ui.item.value, ui.item.label);
            };
        }
        $(searchBox).autocomplete(autocompleteDatasource);
        if (search){
            $(searchBox).autocomplete('search');
        }
    },
}

function formatSearchResult(results, idProperty, resultValue, resultLabel){
	var formattedData = [];
	results.forEach(function(value,key){
		formattedData[formattedData.length] = {
            'id': value[idProperty],
			'label': value[resultLabel], //should be able to use more flexible expression
            'value': value[resultValue],
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

var docCookies = {
  getItem: function (sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    if (!sKey) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};