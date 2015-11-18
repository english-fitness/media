var startTime = ['07:00', '07:40', '08:20', '09:00', '09:40' ,'10:20','11:00', '11:40', '12:20', '13:00', '13:40', '14:20', '15:00', '15:40', '16:20',
				'17:00', '17:40', '18:20', '19:00', '19:40', '20:20', '21:00', '21:40', '22:20'];
				
var endTime = ['07:30', '08:10', '08:50', '09:30', '10:10', '10:50','11:30', '12:10', '12:50', '13:30', '14:10', '14:50', '15:30', '16:10', '16:50',
				'17:30', '18:10', '18:50', '19:30', '20:10', '20:50', '21:30', '22:10', '22:50'];

var momentStartTime = [];
var momentEndTime = [];
var timeslotCount = startTime.length;

var today = moment().format("YYYY-MM-DD");

for (var i in startTime){
	momentStartTime.push(moment(today + " " + startTime[i]));
}
for (var i in endTime){
	momentEndTime.push(moment(today + " " + endTime[i]));
}

function parseTimeslot(slotNumber){
	var dayIndex = Math.floor(slotNumber/timeslotCount);
	var slotIndex = slotNumber - dayIndex*timeslotCount;

	var timeslot = {
		day: dayIndex,
		time: slotIndex,
	};
	
	return timeslot;
}

//day start with 0
function getTimeslot(day, time){
	timeslot = startTime.indexOf(time);
	console.log(timeslotCount);
	if (timeslot > -1){
		return day*timeslotCount + timeslot;
	} else {
		var slot = moment(today + " " + time);
		for (var i = 0; i < momentStartTime.length - 1; i++){
			if (slot.isBetween(momentStartTime[i], momentStartTime[i+1])){
				return day*timeslotCount + i;
			}
		}
	}

	return -1;
}

function getTimeslotText(slotNumber, week){
	var slotInfo = parseTimeslot(slotNumber);
	return moment().day(slotInfo.day + 1).week(week).format("dddd, DD-MM-YYYY") + "<br>" + startTime[slotInfo.time] + "-" + endTime[slotInfo.time];
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
		
		var date = moment(availableSlotsData.weekStart).add(slotInfo.day, 'days').format("YYYY-MM-DD");
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