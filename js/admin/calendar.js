//A. Calendar pop-up and forms handling
var CalendarSessionHandler = {
	newSession: function(preset, action, options){
		var start = preset.start;
		var day = start.format('YYYY-MM-DD');
		var startHour = start.format('H');
		var startMin = start.format('m');
		
		var teacher = preset.teacher;
		
		popup({
            width:"450px",
            title:"Tạo buổi học",
            content: function(formCreator){
				var elementCreator = formCreator.tempForm();
		
				var hourOptions = '';
				
				for (hour in options.hours)
				{
					hourOptions += elementCreator.option(hour, hour, (parseInt(hour) == startHour) ? "selected" : "");
				}
				
				var minuteOptions = '';
				
				for (min in options.minutes)
				{
					minuteOptions += elementCreator.option(min, min, (parseInt(min) == startMin) ? "selected" : "");
				}
				
				var hourSelection = elementCreator.select({id:"startHour", name:"startHour", style:"width:55px; align:center"}, hourOptions);
				var minuteSelection = elementCreator.select({id:"startMin", name:"startMin", style:"width:55px; align:center"}, minuteOptions);
				
				
                var form = formCreator.getForm({"id":"newSessionForm","action":action,"method":"post","class":"myFormPopup"});
                form += formCreator.rowForm("Chủ đề buổi học:",elementCreator.input({"type":"text","name":"Session[subject]"}));
				form += formCreator.rowForm("Học sinh:", elementCreator.input({"id":"ajaxSearchUser","type":"text", "class":"form-control class_email"}));
				form += formCreator.rowForm("Khóa học:", elementCreator.select({"id":"courseSelect", "name":"Session[course_id]"}, elementCreator.option("", "Chọn khóa học")));
				form += formCreator.rowForm("Ngày học:", elementCreator.input({"type":"text", "name":"Session[plan_start]", "value":day}));
				form += formCreator.rowForm("Thời gian:", hourSelection + 'Giờ&nbsp&nbsp' + minuteSelection + ' Phút');
				form += "<input type='hidden' name='Session[plan_duration]' value='30'></input>";
				form += "<input type='hidden' name='Session[teacher_id]' value="+teacher+"></input>";
                form += formCreator.endForm({"name":"save"},"Hoàn Thành");
                return form;
            }
        });
		
		var selectedHour = $('#startHour').val();
		$('#startHour option').sort(function(a,b){
			a = parseInt(a.value);
			b = parseInt(b.value);

			return a-b;
		}).appendTo('#startHour');
		$('#startHour').val(selectedHour);
		
		var selectedMin = $('#startMin').val();
		$('#startMin option').sort(function(a,b){
			a = parseInt(a.value);
			b = parseInt(b.value);

			return a-b;
		}).appendTo('#startMin');
		$('#startMin').val(selectedMin);
	}
}

//B. Calendar display and timezone handling

var startTime = ['11:00', '11:40', '12:20', '13:00', '13:40', '14:20', '15:00', '15:40', '16:20',
				'17:00', '17:40', '18:20', '19:00', '19:40', '20:20', '21:00', '21:40', '22:10'];
				
var endTime = ['11:30', '12:10', '12:50', '13:30', '14:10', '14:50', '15:30', '16:10', '16:50',
				'17:30', '18:10', '18:50', '19:30', '20:10', '20:50', '21:30', '22:10', '22:50'];

function parseTimeslot(slotNumber){
	var dayIndex = Math.floor(slotNumber/18);
	var slotIndex = slotNumber - dayIndex*18;

	//we want monday to be the first day (day 0), so sunday must be the last one, but it is actually 'day 0' so...
	//so silly
	var timeslot = {
		day: (dayIndex != 6) ? dayIndex + 1 : 0,
		time: slotIndex,
	};
	
	//put timezone conversion code here for teacher script
	
	return timeslot;
}

function getAvailableTimeslot(availableSlotsData, timezone){
	var slotNumbers = availableSlotsData.split(/[,;]\s*/);
	var id = 0;
	
	var timeslots = [];
	
	for(i in slotNumbers){
		var slotInfo = parseTimeslot(slotNumbers[i]);
		var slotNumber = slotInfo.time;
		
		var day;
		var start;
		var end
		
		if (timezone){
			slotInfo = convertAvailableSlotByTimezone(slotInfo, 7, timezone);
			console.log(slotInfo);
			day = slotInfo.day;
			start = slotInfo.start;
			end = slotInfo.end;
		} else {
			day = slotInfo.day;
			start = startTime[slotInfo.time];
			end = endTime[slotInfo.time];
		}
		
		if (!timeslots[slotNumber]){
			timeslots[slotNumber] = {
				id: id,
				title: 'Available',
				backgroundColor: 'yellow',
				className: 'reservedSlot',
				start: start,
				end: end,
				dow: [day],
			}
			id++;
		} else {
			if (timeslots[slotNumber].dow.indexOf(day) == -1){
				timeslots[slotNumber].dow.push(day);
			}
		}
	}
	
	//full calendar don't like abnormal index like our timeslots array
	//so we fetch those slots into another one
	var result = [];
	
	for(i in timeslots){
		if (timeslots[i] != undefined){
			result.push(timeslots[i]);
		}
	}
	
	return result;
}

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

function convertTimezone(day, time, from, to){
	var newTime = {
		day: day,
		time: time,
	};
	
	if (from == to)
		return newTime;
	
	var parsed = time.split(':');
	var hour = parseInt(parsed[0]);
	var minute = parseInt(parsed[1]);
	
	var offset = to - from;
	
	var newHour;
	var newDay;
	
	if ((hour + offset) > 24){
		newHour = offset - (24 - hour);
		if (day == 6){
			newDay = 0;
		} else {
			newDay = day + 1;
		}
	} else if ((hour + offset) < 0){
		newHour = 24 + hour + offset;
		if (day == 0){
			newDay = 6
		} else {
			newDay = day - 1;
		}
	} else {
		newHour = hour + offset;
		newDay = day;
	}
	
	newTime = {
		day: newDay,
		time: newHour + ':' + minute,
	};
	
	return newTime;
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
		//Hint: check if offset is odd or even
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