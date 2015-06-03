var CalendarSessionHandler = {
	newSession: function(start, action, options){
		var startHour = start.format('H');
		var startMin = start.format('m');
		
		popup({
            width:"450px",
            title:"Tạo buổi học",
            content: function(event){
				var temp = event.tempForm();
		
				var hourOptions = '';
				
				for (hour in options.hours)
				{
					hourOptions += temp.option(hour, hour, (parseInt(hour) == startHour) ? "selected" : "");
				}
				
				var minuteOptions = '';
				
				for (min in options.minutes)
				{
					minuteOptions += temp.option(min, min, (parseInt(min) == startMin) ? "selected" : "");
				}
				
				var hourSelection = temp.select({id:"startHour", name:"startHour", style:"width:55px; align:center"}, hourOptions);
				var minuteSelection = temp.select({id:"startMin", name:"startMin", style:"width:55px; align:center"}, minuteOptions);
				
				
                var form = event.getForm({"id":"newSessionForm","action":action,"method":"post","class":"myFormPopup"});
                form +=event.rowForm("Chủ đề buổi học:",temp.input({"type":"text","name":"title"}));
				form +=event.rowForm("Thời gian:", hourSelection + 'Giờ&nbsp&nbsp' + minuteSelection + ' Phút');
                form +=event.endForm({"name":"save"},"Hoàn Thành");
                return form;
            }
        });
		
		$('#startHour option').sort(function(a,b){
			a = a.value;
			b = b.value;

			return a-b;
		}).appendTo('#startHour');
		$('#startHour').val(selected);
		
		$('#startMin option').sort(function(a,b){
			a = a.value;
			b = b.value;

			return a-b;
		}).appendTo('#startMin');
		$('#startMin').val(selected);
	}
}