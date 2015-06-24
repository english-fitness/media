function removeParameterFromUrl(url,paramName){
	var reg = new RegExp('&?'+paramName+'=([^&]$|[^&]*)','gi');
	return url.replace(reg, "");
}
$(document).on("keypress","#yw0 .filters input",function(event ){
  if (event.which == 13 && $(this).val()=='') {
	  searchUrl = $('#yw0 .keys').attr('title');
	  $(".filters input, .filters select").each(function (){
		  if($(this).val()==''){
			  emptyParamName = $(this).attr('name').replace('[', '\\[');
			  emptyParamName = emptyParamName.replace(']', '\\]');
			  searchUrl = removeParameterFromUrl(searchUrl, emptyParamName);
		  }
	  });
	  history.pushState({}, '', searchUrl);
	  $('#yw0 .keys').attr('title', searchUrl);
	  $.fn.yiiGridView.update('yw0');
  }
});
