//form validate
function validate(form) {
	if (typeof form == "string"){
		form = $('#'+form);
	}
	if (form instanceof jQuery){
		var fullname = form.find(".form-attr[data-attr=fullname]").val();
		var validName = true;
		var nameNotice = form.find(".fullname.invalid-notice");
		if (!fullname) {
			nameNotice.html("Hãy nhập tên của bạn").show();
			validName = false;
		} else {
			nameNotice.hide();
		}

		var phone = form.find(".form-attr[data-attr=phone]").val();
		var validPhone = true;
		var phoneNotice = form.find(".phone.invalid-notice");
		if (!phone) {
			phoneNotice.html("Hãy nhập số điện thoại của bạn").show();
			validPhone = false;
		} else if (!phone.match(/^\+{0,1}[0-9\-\s]{8,16}$/)) {
			phoneNotice.html("Số điện thoại không hợp lệ").show();
			validPhone = false;
		} else {
			phoneNotice.hide();
		}

		var email = form.find(".form-attr[data-attr=email]").val();
		var validEmail = true;
		var emailNotice = form.find(".email.invalid-notice");
		if (email != "" && !email.match(/^([\w-\+]+(?:\.[\w-\+]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,10}(?:\.[a-z]{2})?)$/)) {
			emailNotice.html("Email không hợp lệ").show();
			validEmail = false;
		} else {
			emailNotice.hide();
		}
		
		return (validName && validPhone && validEmail);
	}
	
	return false;
}

//global var for requesting
var requesting = false;

function quickRegister(data){
    if (!requesting) {
		requesting = true;
		$.ajax({
			type: "POST",
			url: "/register/contact",
			data: data,
			success: function (response) {
				if (response.success) {
					window.location.href = "/news/afterRegistration?id=" + response.model.id;
				} else {
					alert("Thông tin đăng ký không hợp lệ. Bạn hãy kiểm tra lại thông tin đăng ký. Bạn cần nhập thông tin chính xác để chúng tôi có thể liên hệ với bạn");
				}
				requesting = false;
			},
			error: function () {
				requesting = false;
			}
		});
	}
}

function register(data){
	if (!requesting) {
		requesting = true;
		$.ajax({
			type: "POST",
			url: "/register/contact",
			data: data,
			success: function (response) {
				if (response.success) {
					window.location.href = "/news/registrationSuccess";
				} else {
					alert("Thông tin đăng ký không hợp lệ. Bạn hãy kiểm tra lại thông tin đăng ký. Bạn cần nhập thông tin chính xác để chúng tôi có thể liên hệ với bạn");
				}
				requesting = false;
			},
			error: function () {
				requesting = false;
			}
		});
	}
}

$(document).ready(function () {
    //page navigator
    $('.teleporter').click(function (e) {
        e.preventDefault();
        var waypoint = $('#' + $(this).data('waypoint'));
        jump(waypoint);
        return false;
    });
    
    function jump(destination){
        var position = destination.offset().top;
        $('body,html').animate({ scrollTop: position }, 500);
    }
});

//utils
function array_rand (array, num) {
  var indexes = [];
  var ticks = num || 1;
  var checkDuplicate = function (array, value) {
    var exist = false,
      index = 0,
      il = array.length;
    while (index < il) {
      if (array[index] === value) {
        exist = true;
        break;
      }
      index++;
    }
    return exist;
  };
 
  if (Object.prototype.toString.call(array) === '[object Array]' && ticks <= array.length) {
    while (true) {
      var rand = Math.floor((Math.random() * array.length));
      if (indexes.length === ticks) {
        break;
      }
      if (!checkDuplicate(indexes, rand)) {
        indexes.push(rand);
      }
    }
  } else {
    indexes = null;
  }
 
  return ((ticks == 1) ? indexes.join() : indexes);
}

function randomSubArray(array, num){
    if (num > array.length){
        num = array.length;
    }
    
    var random_key = array_rand(array, num);
    
    var subArray = [];
    if ($.isArray(random_key)){
        for (var i in random_key){
            subArray.push(array[random_key[i]]);
        }
    } else {
        subArray.push(array[random_key]);
    }
    
    return subArray;
}

function implode(glue, array){
    var result = '';
    var length = array.length - 1;
    for(var i = 0; i < length; i++){
        result += array[i] + glue;
    }
    result += array[length];
    
    return result;
}