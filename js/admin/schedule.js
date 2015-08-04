//Schedule UI
var CalendarSessionHandler = {
	newSession: function(values, successCallback, errorCallback){
		var start = values.start;
		var day = start.format('YYYY-MM-DD');
		var startHour = start.format('HH');
		var startMin = start.format('mm');
		
		var teacher = values.teacher;
		
		var classOptions = '';
		if (classes != undefined){
			for(var i in classes){
				classOptions += "<option value=" + classes[i].id + ">" + classes[i].name + "</option>";
			}
		}
		
		popup({
            width:"450px",
            title:"Tạo buổi học",
            content: function(formCreator){
				var elementCreator = formCreator.popupForm();				
				
                var form = formCreator.getForm({"id":"newSessionForm","method":"post","class":"myFormPopup"});
                form += formCreator.newRow("Chủ đề buổi học:",elementCreator.input({"type":"text","name":"Session[subject]",id:"sessionTitle"}));
				form += formCreator.newRow("Học sinh:", elementCreator.input({"id":"ajaxSearchStudent", "type":"text", "class":"form-control class_email"}));
				form += formCreator.newRow("Khóa học:", elementCreator.select({"id":"courseSelect", "name":"Session[course_id]"}, elementCreator.option("", "Chọn khóa học")));
				
				form += '<div class="row-form" id="classSelectRow" style="display:none"><div class="label">Lớp:</div><div class="value">' +
							elementCreator.select({id:"classSelect"}, classOptions) +
						'</div></div>';
				form += '<div class="row-form" id="subjectSelectRow" style="display:none"><div class="label">Môn học:</div><div class="value">' +
							elementCreator.select({id:"subjectSelect", name:"subjectId", disabled:true}) +
						'</div></div>';
				form += formCreator.newRow("Ngày học:", elementCreator.input({"type":"text", "name":"Session[plan_start]", "value":day, "readonly":true}));
				form += formCreator.newRow("Thời gian:", 
					elementCreator.input({"type":"text", "name":"startHour", "value":startHour, style:"width:35px; align:center", "readonly":true,}) + 'Giờ&nbsp&nbsp' + 
					elementCreator.input({"type":"text", "name":"startMin", "value":startMin, style:"width:35px; align:center", "readonly":true}) + ' Phút');
				form += "<input type='hidden' name='studentId' id='hiddenStudentId'></input>";
				form += "<input type='hidden' name='Session[plan_duration]' value='30'></input>";
				form += "<input type='hidden' name='Session[teacher_id]' value="+teacher+"></input>";
				form += formCreator.newRow("&nbsp;","<button id='createSession'>Hoàn thành</button>");
				form += '</form>';
                return form;
            }
        });
		
		$('#createSession').on('click', function(e){
			ajaxCreateSession(values.action, successCallback, errorCallback);
			removePopupByID('popupAll');
			e.preventDefault();
			return false;
		});
		
		$('#classSelect').on('change', function(){
			$.ajax({
				url:'/admin/course/ajaxLoadSubjectsArray',
				type:'post',
				data:{
					class_id:$(this).val(),
				},
				success:function(response){
					var subjectOptions = '';
					var subjects = response.subjects;
					for (var i in subjects){
						subjectOptions += '<option value=' + subjects[i].id + '>' + subjects[i].name + '</option>';
					}
					$('#subjectSelect').html(subjectOptions);
				}
			});
		});
		
		$('#courseSelect').on('change', function(){
			if ($(this).val() > 0){
				document.getElementById('classSelectRow').style.display = "none";
				document.getElementById('subjectSelectRow').style.display = "none";
				document.getElementById('subjectSelect').disabled = true;
				autoFillSessionTitle($(this).val());
			} else {
				document.getElementById('classSelectRow').style.display = "block";
				$('#classSelect').change();
				document.getElementById('subjectSelectRow').style.display = "block";
				document.getElementById('subjectSelect').disabled = false;
				document.getElementById("sessionTitle").value = "Session 1";
			}
		})
	},
	
	editSession : function(data, successCallback, errorCallback){
		var start = data.start;
		var day = start.format('YYYY-MM-DD');
		var startHour = start.format('HH');
		var startMin = start.format('mm');
		
		popup({
            width:"450px",
            title:"Thông tin buổi học",
            content: function(formCreator){
				var elementCreator = formCreator.popupForm();			
				
                var form = formCreator.getForm({"id":"updateSessionForm","method":"post","class":"myFormPopup"});
                form += formCreator.newRow("Chủ đề buổi học:",elementCreator.input({"type":"text","name":"Session[subject]", value:data.subject}));
				form += formCreator.newRow("Giáo viên:", data.teacherName);
				form += formCreator.newRow("Học sinh:", elementCreator.input({"id":"ajaxSearchStudent","type":"text", "class":"class_email", value:data.student}));
				form += formCreator.newRow("Khóa học:", elementCreator.select({"id":"courseSelect", "name":"Session[course_id]"}, elementCreator.option("", data.course_id)));
				form += formCreator.newRow("Ngày học:", day);
				form += formCreator.newRow("Thời gian:", startHour + '&nbspGiờ&nbsp&nbsp' + startMin + ' Phút');
				form += "<input type='hidden' name='Session[plan_start]' value = '"+ start.format('YYYY-MM-DD HH:mm:ss') +"'></input>";
				form += "<input type='hidden' name='sessionId' value = '"+ data.sessionId +"'></input>";
				form += "<input type='hidden' name='studentId' id='hiddenStudentId'></input>";
				var editRow = "";
				var deleteRow = "";
				switch (data.className[0]){
					case 'ongoingSession':
						editRow += "<a href='#' onclick='endSession("+ data.sessionId +", "+ data.end +");removePopupByID"+'("popupAll")'+";return false;'>Kết thúc buổi học</a>&emsp;";
						break;
					case 'approvedSession':
						deleteRow += "<a href='/admin/session/cancel/id/"+ data.sessionId +"' target='_blank'>Hủy buổi học</a>&emsp;";
						break;
					case 'pendingSession':
						form += formCreator.newRow("","<a href='#' onclick='approveSession("+ data.sessionId +");removePopupByID"+'("popupAll")'+";return false;'>Xác nhận buổi học</a>&emsp;");
						break;
					default:
						break;
				}
				if (data.className[0] != 'ongoingSession'){
					editRow += "<a href='#' onclick='toggleChangeSchedule(true, "+ data.sessionId +");removePopupByID"+'("popupAll")'+";return false;'>Đổi lịch học</a>&emsp;&nbsp&nbsp";
					deleteRow += "<a href='#' onclick='deleteSession("+ data.sessionId +");removePopupByID"+'("popupAll")'+";return false;' style='color:red'>Xóa buổi học</a>&emsp;";
				}
				editRow += "<a href='/admin/session/update/id/"+ data.sessionId +"' target='_blank'>Sửa buổi học</a>&emsp;";
				if (editRow != ""){
					form += formCreator.newRow("", editRow);
				}
				if (deleteRow != ""){
					form += formCreator.newRow("", deleteRow);
				}
				form += formCreator.newRow("&nbsp;","<button id='saveSession'>Lưu lại</button>" +
													 "<button id='cancel' onclick='removePopupByID"+'("popupAll")'+";return false;'>Đóng</button>");
				form += '</form>';
                return form;
            }
        });
		
		$('#saveSession').on('click', function(e){
			saveSession(data.action, successCallback, errorCallback);
			removePopupByID('popupAll');
			e.preventDefault();
			return false;
		});
	}
}

function ajaxCreateSession(action, successCallback, errorCallback){
	$.ajax({
		url: action,
		type:'post',
		data:$('#newSessionForm').serialize(),
		success: function(response){
			if (response.success){
				successCallback.call(undefined, response);
			} else {
				errorCallback.call(undefined, response);
			}
		},
	});
}

function saveSession(action, successCallback, errorCallback){
	$.ajax({
		url: action,
		type:'post',
		data:$('#updateSessionForm').serialize(),
		success: function(response){
			if (response.success){
				successCallback.call(undefined, response);
			} else {
				errorCallback.call(undefined, response);
			}
		},
	});
}

//end of ui