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

//event handlers
function createSessionSuccess(){
    reloadAll();
}

function createSessionError(response){
    if (response.existingSession){
        $("<div>Học sinh này đã đặt lịch học với một giáo viên khác trong cùng khung giờ. " +
        "Bạn có thể thay đổi giáo viên cho buổi học</div>").dialog({
            modal:true,
            resizable:false,
            buttons:{
                "Thay đổi giáo viên": function(){
                    changeTeacher(response)
                    $(this).dialog('close');
                },
                "Hủy": function(){
                    $(this).dialog('close');
                }
            }
        });
    } else {
        displayConfirmDialog("Đặt lịch học", "Có lỗi xảy ra khi đặt lịch học, vui lòng thử lại sau", "Đóng");
    }
}

function updateSessionSuccess(){
    reloadAll();
}

function updateSessionError(response){
    if (response.existingSession){
        $("<div>Học sinh này đã đặt lịch học với một giáo viên khác trong cùng khung giờ. " +
        "Bạn có thể thay đổi giáo viên cho buổi học</div>").dialog({
            modal:true,
            resizable:false,
            buttons:{
                "Thay đổi giáo viên": function(){
                    duplicateSessionUpdate(response)
                    $(this).dialog('close');
                },
                "Hủy": function(){
                    $(this).dialog('close');
                }
            }
        });
    } else {
        displayConfirmDialog("Đặt lịch học", "Có lỗi xảy ra khi đặt lịch học, vui lòng thử lại sau", "Đóng");
    }
}

function duplicateSessionUpdate(data){
    $.ajax({
        url:'/admin/schedule/calendarUpdateSession',
        type:'post',
        data:{
            duplicateSession: true,
            existingSession: data.existingSession,
            currentSession: data.currentSession,
            courseId: data.currentCourse,
            subject: data.currentSubject,
            studentId: data.currentStudent,
        },
        success:function(response){
            if (response.success){
                reloadAll();
            } else {
                displayConfirmDialog("Đặt lịch học", "Có lỗi xảy ra khi đặt lịch học, vui lòng thử lại sau", "Đóng");
            }
        }
    });
}

function changeTeacher(data){
    $.ajax({
        url:'/admin/schedule/calendarUpdateSession',
        type:'post',
        data:{
            changeTeacher: true,
            session: data.existingSession,
            teacher: data.teacher
        },
        success:function(response){
            if (response.success){
                reloadAll();
            } else {
                displayConfirmDialog("Đặt lịch học", "Có lỗi xảy ra khi đặt lịch học, vui lòng thử lại sau", "Đóng");
            }
        }
    });
}

function deleteSession(sessionId){
    $('<div>Bạn có muốn xóa buổi học này?</div>').dialog({
        modal:true,
        resizable:false,
        buttons: {
            "Xóa": function(){
                $.ajax({
                    url:'/admin/schedule/calendarDeleteSession',
                    type:'post',
                    data:{
                        id:sessionId,
                    },
                    success:function(){
                        reloadAll();
                    }
                });
                $(this).dialog('close');
            },
            "Hủy": function(){
                $(this).dialog('close');
            }
        }
    });
}

function approveSession(id){
    $('<div>Bạn có muốn xác nhận buổi học này?</div>').dialog({
        modal:true,
        resizable:false,
        buttons: {
            "Xác nhận": function(){
                $.ajax({
                    url:'/admin/session/ajaxApprove',
                    type:'post',
                    data:{
                        session_id: id,
                    },
                    success:function(response){
                        if (!response.success){
                            displayConfirmDialog('Xác nhận buổi học', 'Đã có lỗi xảy ra, vui lòng thử lại sau', 'Đóng');
                        } else {
                            if (response.pendingCourse){
                                $("<div>Buổi học của khóa học này vẫn chưa được xác nhận"+
                                ". Các buổi học của khóa học này sẽ không được nhìn thấy.<br>"+
                                "Bạn có muốn xác nhận khóa học này?</div>").dialog({
                                    title:'Xác nhận khóa học',
                                    width:500,
                                    modal:true,
                                    resizable:false,
                                    buttons:{
                                        "Xác nhận":function(){
                                            $.ajax({
                                                url:'/admin/course/ajaxApprove',
                                                type:'post',
                                                data:{
                                                    course_id: response.pendingCourse,
                                                },
                                                success: function(response){
                                                    if (!response.success){
                                                        displayConfirmDialog('Xác nhận khóa học', 'Đã có lỗi xảy ra, vui lòng thử lại sau', 'Đóng');
                                                    }
                                                }
                                            })
                                            $(this).dialog('close');
                                        },
                                        "Đóng":function(){
                                            $(this).dialog('close');
                                        },
                                    }
                                });
                            }
                            reloadAll();
                        }
                    }
                });
                $(this).dialog('close');
            },
            "Hủy": function(){
                $(this).dialog('close');
            }
        }
    });
}

function endSession(id, endTime){
    var now = moment();
    var end = moment(endTime);

    if (end.diff(now) > 0){
        displayConfirmDialog("Kết thúc buổi học", "Buổi học vẫn chưa hết thời gian", "Đóng");
    } else {
        $('<div>Bạn có muốn kết thúc buổi học này?</div>').dialog({
            title:"Kết thúc buổi học",
            modal:true,
            resizable:false,
            buttons: {
                "Kết thúc": function(){
                    $.ajax({
                        url:'/api/session/end',
                        type:'get',
                        data:{
                            sessionId: id,
                            forceEnd: true,
                        },
                        success:function(){
                            reloadAll();
                        }
                    });
                    $(this).dialog('close');
                },
                "Hủy": function(){
                    $(this).dialog('close');
                }
            }
        });
    }
}

function toggleChangeSchedule(changing, session){
    changingSchedule = changing;
    if (changing){
        pendingChangeSession = session;
        $('#changingSchedule').show();
    } else {
        pendingChangeSession = null;
        $('#changingSchedule').hide();
    }
}

function changeSchedule(session, values){
    $('<div>Bạn có muốn thay đổi lịch học sang khung giờ này?</div>').dialog({
        title:"Đổi lịch học",
        modal:true,
        resizable:false,
        buttons:{
            "Đồng ý": function(){
                $.ajax({
                    url:'/admin/schedule/changeSchedule',
                    data:{
                        sessionId: session,
                        teacher:values.teacher,
                        start:values.start,
                    },
                    type:"post",
                    success:function(response){
                        if (response.success){
                            reloadAll();
                        } else {
                            if (response.reason == "duplicate_session"){
                                displayConfirmDialog("Đổi lịch học", "Học sinh trong buổi học này đã có một buổi học"+
                                " với giáo viên khác trong cùng khung giờ. Bạn không thể chuyển buổi học sang khung giờ này", "Đóng");
                            } else {
                                displayConfirmDialog("Đổi lịch học", "Đã có lỗi xảy ra, vui lòng thử lại sau", "Đóng");
                            }
                        }
                    }
                });
                $(this).dialog('close');
                toggleChangeSchedule(false);
            },
            "Hủy": function(){
                $(this).dialog('close');
            }
        }
    });
}

function displayConfirmDialog(title, confirmText, confirmButton){
    var buttons = {};
    buttons[confirmButton] = function(){
        $(this).dialog('close');
    };
    $("<div>"+confirmText+"</div>").dialog({
        title:title,
        modal:true,
        resizable:false,
        buttons:buttons,
    });
}