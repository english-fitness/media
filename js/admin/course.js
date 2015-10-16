//Javascript for register course in admin
//Auto complete suggest title for course
function suggestTitles(){
	var data = {'subject_id': $('#Course_subject_id').val()};
	$.ajax({
		url: daykemBaseUrl + "/admin/course/ajaxLoadSuggestion",
		type: "POST", dataType: 'JSON',data:data,
		success: function(data) {
			$( "#Course_title" ).autocomplete({
			      source: data.suggestions
			});
		}
	});
}

//Ajax Subject change
function ajaxSubjectChange(){
	ajaxLoads({'subject_id': $('#Course_subject_id').val()}, 'divDisplayTeacher', 'course/ajaxLoadTeachers');
	suggestTitles();//Load title suggestion by subject id
}

//Generate schedule session with suggest day & hour
function generateSchedule(){
	var nPerWeek = parseInt($('#numberSessionPerWeek').val());
	//Load ajax subjects by class
	var data = {'nPerWeek': nPerWeek};
	$.ajax({
		url: daykemBaseUrl + "/admin/course/ajaxSuggestSchedules",
		type: "POST", dataType: 'html',data:data,
		success: function(data) {
			$('#selectedSchedule').html(data);
		}
	});
}

//Ajax loads function
function ajaxLoads(jsonParams, displayElement, ajaxPostUrl){
	var data = jsonParams;
	$.ajax({
		url: daykemBaseUrl + "/admin/" + ajaxPostUrl,
		type: "POST", dataType: 'html',data:data,
		success: function(data) {
			$('#'+displayElement).html(data);
		}
	});
}

//Check course validate in register course
function checkCourseValidate(){
	var subject_id, title, number, start_date, checkvalid;
	subject_id = $("#Course_subject_id").val();
	//title = $("#Course_title").val();
	wnumber = $("#numberSessionPerWeek").val();
	totalSession = $("#numberOfSession").val();
	start_date = $("#startDate").val();
	checkvalid = true;
	if(wnumber=="" || start_date=="" || totalSession<0 || totalSession>200){
		checkvalid = false;
	}else{
		if(!(start_date>=currentDate && start_date<="2100-01-01")){
			checkvalid = false;
		}
	}
	return checkvalid;
}
//Document ready on create course
$(document).ready(function() {
	$('#tutorClasses').change(function(){
		//Load ajax subjects by class
		ajaxLoads({'class_id': $(this).val()}, 'divDisplaySubject', 'course/ajaxLoadSubjects');
	});
	$('#btnCreate').click(function(){
		var check_valid = checkCourseValidate();
		if(check_valid){
			$("#validMessage").html("<span style='color:blue'>Đang tạo khóa học. Vui lòng chờ...</span>");
		}
		$("#course-form").submit();
	});
	$('#tutorClasses').change();
});