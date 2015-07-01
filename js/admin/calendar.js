//A. Calendar pop-up and forms handling
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

//B. Calendar display

var startTime = ['09:00', '09:40' ,'10:20','11:00', '11:40', '12:20', '13:00', '13:40', '14:20', '15:00', '15:40', '16:20',
				'17:00', '17:40', '18:20', '19:00', '19:40', '20:20', '21:00', '21:40', '22:20'];
				
var endTime = ['09:30', '10:10', '10:50','11:30', '12:10', '12:50', '13:30', '14:10', '14:50', '15:30', '16:10', '16:50',
				'17:30', '18:10', '18:50', '19:30', '20:10', '20:50', '21:30', '22:10', '22:50'];

function parseTimeslot(slotNumber){
	var dayIndex = Math.floor(slotNumber/21);
	var slotIndex = slotNumber - dayIndex*21;

	var timeslot = {
		day: dayIndex,
		time: slotIndex,
	};
	
	return timeslot;
}

function getAvailableTimeslot(availableSlots, timezone){
	var timeslots = [];
	
	for (var i in availableSlots){
		timeslots = timeslots.concat(normalizeAvailableTimeslot(availableSlots[i], timezone));
	}
	
	return timeslots;
}

function normalizeAvailableTimeslot(availableSlotsData, timezone){
	//timezone part not finished yet
	var availableTimeslots = availableSlotsData.timeslots;
	
	if (availableTimeslots.trim() == '') return [];
	
	var slotNumbers = availableTimeslots.split(/[,;]\s*/);
	var id = 0;
	
	var timeslots = [];
	
	for(i in slotNumbers){
		var slotInfo = parseTimeslot(slotNumbers[i]);
		var slotNumber = slotInfo.time;
		
		var date = addDay(availableSlotsData.weekStart, slotInfo.day);
		var start;
		var end;
		
		if (timezone){
			slotInfo = convertAvailableSlotByTimezone(slotInfo, 7, timezone);
			// day = slotInfo.day;
			start = slotInfo.start;
			end = slotInfo.end;
		} else {
			// day = slotInfo.day;
			start = date + ' ' + startTime[slotInfo.time];
			end = date + ' ' + endTime[slotInfo.time];
		}
		
		
		var slot = {
			title: 'Available',
			backgroundColor: 'yellow',
			className: 'reservedSlot',
			start: start,
			end: end,
			resources:availableSlotsData.teacher,
			teacher: availableSlotsData.teacher,
			// dow: [day],
		}
		
		timeslots.push(slot);
	}
	
	return timeslots;
}

//C. Utilities

function convertAvailableSlotByTimezone(timeslot, from, to){
	if (from == to) {
		var result = {
			day: timeslot.day,
			start: startTime[timeslot.time],
			end: endTime[timeslot.time],
		}
		return result;
	}
	
	var offset = to - from;
	
	var startNumbers = startTime[timeslot.time].split(':');
	var endNumbers = endTime[timeslot.time].split(':');
	
	var day = timeslot.day;
	var startHour = parseInt(startNumbers[0]);
	var endHour = parseInt(endNumbers[0]);
	
	//it can handle whatever positive time, but no negative time, so...
	if ((startHour + offset) >= 0){
		startHour = startHour + offset;
		endHour = endHour + offset;
	} else {
		startHour = 24 + startHour + offset;
		endHour = 24 + endHour + offset;
		if (day == 0){
			day = 6
		} else {
			day -= 1;
		}
	}
	
	var result = {
		day: day,
		start: startHour + ':' + startNumbers[1],
		end: endHour + ':' + endNumbers[1],
	};
	
	return result;
}

function convertRangeByTimezone(minTime, maxTime, from, to){
	var result;

	if (from == to){
		result = {
			minTime: minTime,
			maxTime: maxTime,
		};
		return result;
	}
	
	var minTimeNumbers = minTime.split(':');
	var maxTimeNumbers = maxTime.split(':');
	
	var minHour = parseInt(minTimeNumbers[0]);
	var maxHour = parseInt(maxTimeNumbers[0]);

	var offset = to - from;
	
	minHour += offset;
	maxHour += offset;
	
	if (minHour >= 24){
		min -= 24;
		if (maxHour > 24){
			max -= 24;
		}
	} else if (minHour < 0) {
		minHour += 24;
		if (maxHour < 0){
			maxHour += 24;
		}
	} else if (minHour < 24 && maxHour >= 24){
		maxHour -= 24;
	}
	
	//if timeslots ovelap between two days, we have to display all day, so annoying =.=
	//we also need to disable the range in between, even more annoying (╯°□°）╯︵ ┻━┻
	if (minHour < maxHour){
		//TODO: it does mess up the timeslot so do remember to change the minute part
		//Update: done
		result = {
			minTime: minHour + ":" + minTimeNumbers[1],
			maxTime: maxHour + ":" + maxTimeNumbers[1],
		};
	} else {
		if (offset % 2 != 0){
			result = {
				minTime: '00:00',
				maxTime: '24:00',
			};
		} else {
			result = {
				minTime: '00:20',
				maxTime: '24:20',
			};
		}
	}
	
	return result;
}

function addDay(date, amount, delimiter){
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

//searchBoxHandler
function bindSearchBoxEvent(searchBoxId, searchFunction){
	$("#"+searchBoxId).keyup(function(){
		var keyword =  $(this).val();
		if(keyword.length<=3 && keyword.length>0) {
			searchFunction.call(undefined, keyword);
		}
	});
}

function searchBoxAutocomplete(searchBox, results, selectCallback){
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