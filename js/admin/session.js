//Javascript for create/update session in admin
//Create board ajax function
function createBoard(id, trial, p2p, nuve, mode){
	var data = {'session_id': id, 'trial': trial, 'p2p': p2p, 'nuve': nuve, 'mode':mode };
	$.ajax({
		url: daykemBaseUrl + "/admin/session/ajaxCreateBoard",
		type: "POST", dataType: 'json', data:data,
		success: function(data) {
			if(data.success){
				var removeBoardLink = '<a href="javascript:removeWhiteboard(\'7688\', \'@1vb9hzmmy2k6mode2\')" class="fR pR5 clrRed">Xóa lớp ảo </a>';
				$('#whiteboard'+id).html("").append($(data.displayBoard).css('float', 'left')).append(removeBoardLink);
			}else{
				alert("Không tạo được lớp học ảo, vui lòng kiểm tra lại!");
			}
		}
	});
}

//Approve session
function approve(id){
	var data = {'session_id': id};
	var checkConfirm = confirm("Bạn có chắc chắn muốn xác nhận buổi học này?");
		if(checkConfirm){
		$.ajax({
			url: daykemBaseUrl + "/admin/session/ajaxApprove",
			type: "POST", dataType: 'json', data:data,
			success: function(data) {
				if(data.success){
					$('#sessionStatus'+id).html('Đã xác nhận');
				}
			}
		});
	}
}
//Delete whiteboard ajax function
function deleteBoard(session_id, board){
	var data = {'session_id':session_id, 'whiteboard': board};
	var checkConfirm = confirm("Bạn có chắc chắn muốn xóa lớp học ảo này?");
	if(checkConfirm){
		$.ajax({
			url: daykemBaseUrl + "/admin/session/ajaxDeleteBoard",
			type: "POST", dataType: 'json', data:data,
			success: function(data) {
				if(data.success){
					$('#whiteboard'+session_id).html(data.displayBoard);
				}else{
					alert("Không xóa được lớp học ảo, vui lòng kiểm tra lại!");
				}
			}
		});
	}
}

//Inline edit
function displayInlineEdit(sessionId){
	$('#txtEditSubject'+sessionId).css('display', '');
	$('#spanEditSubject'+sessionId).css('display', 'none');
}

//Inline edit subject(title) of session
function editSubject(sessionId, event){
	var subject = $("#txtEditSubject"+sessionId).val();
	var code = (event.keyCode ? event.keyCode : event.which);
	if(code==13){//If enter key
		var data = {'session_id': sessionId, 'subject':subject};
		$.ajax({
			url: daykemBaseUrl + "/admin/session/ajaxEditInline",
			type: "POST", dataType: 'json', data:data,
			success: function(data) {
				if(data.success){
					$('#spanEditSubject'+sessionId).html(subject);
					$('#spanEditSubject'+sessionId).css('display', '');
					$('#txtEditSubject'+sessionId).css('display', 'none');
				}
			}
		});
	}
}

//Unassign student to Session
function unassignStudent(student_id, session_id){
	var checkConfirm = confirm("Bạn có chắc chắn muốn loại học sinh này khỏi buổi học?");
	if(checkConfirm){
		window.location = daykemBaseUrl + '/admin/session/unassignStudent?student_id=' + student_id + '&session_id='+session_id;
	}
}

//Remove session
function removeSession(sessionId){
	var checkConfirm = confirm("Bạn có chắc chắn muốn xóa buổi học này?");
	if(checkConfirm){
		window.location = daykemBaseUrl + '/admin/session/delete/id/'+sessionId;
	}
}

//Modify session schedule
function modifySchedule(courseId, modifyDay){
	var data = {'courseId': courseId, 'modifyDay': modifyDay};
	var confirmMsg = 'Bạn có chắc chắn muốn hoãn/lùi khóa học lại 1 buổi về tương lai!';
	if(modifyDay==-1) confirmMsg = 'Bạn có chắc chắn muốn đẩy sớm khóa học 1 buổi về gần hiện tại hơn!';
	if(confirm(confirmMsg)){
		$.ajax({
			url: daykemBaseUrl + "/admin/course/ajaxModifySchedule",
			type: "POST", dataType: 'json',data:data,
			success: function(data) {
				if(data.success){
					alert('Thay đổi lịch các buổi học thành công!');
					window.location.reload();
				}else{
					alert('Thay đổi lịch học không thành công! Hãy kiểm tra lại thời gian buổi học gần nhất trong khóa!');
				}
			}
		});
	}
}

//Allow change schedule
function allowChangeSchedule(){
	$("#divModifySchedule").show();
	$("#divModifyLink").hide();
}