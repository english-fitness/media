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

function register(data){
	if (!requesting) {
		requesting = true;
		$.ajax({
			type: "POST",
			url: "https://speakup.vn/register/contact",
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

function populateTeachers(divId, teachers){
    // var randomTeachers = randomSubArray(teachers, 4);
    
    // for (var i in randomTeachers){
        // addTeacher(divId, randomTeachers[i], i);
    // }
    
    for (var i in teachers){
        addTeacher(divId, teachers[i], i);
    }
}

function addTeacher(divId, teacher, id){
    var teacherDiv = $('#'+divId);
    
    var teacherList = teacherDiv.find('.teacher-list');
    
    var avatar = '<img class="teacher-icon" src="/media/uploads/home/teachers/' + teacher.avatar + '"/>'
    var frameWrapper = $('<div class="teacher-frame"></div>').append(avatar);
    var listItem = $('<li class="teacher-select" data-teacher="' + id + '"></li>').append(frameWrapper);
    
    teacherList.append(listItem);
    
    var teacherContainer = teacherDiv.find('.teachers-container');
    
    var teacherDetail = $('<div class="teacher-detail" data-teacher="' + id + '"></div>');
    
    var thumbnailImg = '<img src="' + teacher.videoThumbnail + '"/>';
    var thumbnail = $('<div class="vid-thumbnail"></div>').append(thumbnailImg);
    var lightbox = $('<a href="' + teacher.video + '" class="html5lightbox"></a>').append(thumbnail);
    var teacherVideo = $('<div class="teacher-video"></div>').append(lightbox);
    
    var teacherInfo = $('<div class="teacher-info accent"></div>');
    
    var name = '<div class="info name"><p><b>Giáo viên: </b>' + teacher.name + '</p></div>';
    var location = '<div class="info location"><p><b>Nơi ở: </b>' + teacher.location + '</p></div>';
    var education = '<div class="info style"><p><b>Học vấn: </b>' + teacher.education + '</p></div>';
    var achievements = '<div class="info achievement"><p><b>Thành tích: </b>' + teacher.achievements + '</p></div>';
    
    teacherInfo.append(name).append(location).append(education).append(achievements);
    
    teacherDetail.append(teacherVideo).append(teacherInfo);
    
    teacherContainer.append(teacherDetail);
}

function populateTestimonials(divId, testimonials){
    var randomTestimonials = randomSubArray(testimonials, 10);
    
    var container = $('#' + divId);
    
    var frontPageDiv = $('<div class="cd-testimonials-wrapper cd-container"></div>');
    var frontPageList = $('<ul class="cd-testimonials"></ul>');
    for (var i in randomTestimonials){
        var testimonial = createTestimonialItem(randomTestimonials[i]);
        frontPageList.append(testimonial);
    }
    var seeAllLink = '<a href="#0" class="cd-see-all">See more</a>';
    frontPageDiv.append(frontPageList).append(seeAllLink);
    
    var allTestimonialDiv = $('<div class="cd-testimonials-all"></div>');
    var allTestimonialWrapper = $('<div class="cd-testimonials-all-wrapper"></div>');
    var allTestimonialList = $('<ul></ul>');
    for (var i in testimonials){
        var testimonial = createTestimonialItem(testimonials[i], ['cd-testimonials-item']);
        allTestimonialList.append(testimonial);
    }
    var closeLink = '<a href="#0" class="close-btn">Close</a>';
    allTestimonialWrapper.append(allTestimonialList);
    allTestimonialDiv.append(allTestimonialWrapper).append(closeLink);
    
    container.append(frontPageDiv).append(allTestimonialDiv);
    
}

function createTestimonialItem(testimonial, cssClass){
    if (cssClass){
        var itemCssClass = ' class="' + implode(' ', cssClass) + '"';
    } else {
        var itemCssClass = '';
    }
    var testimonialElement = '<li' + itemCssClass + '></li>';
    var content = '<p>' + testimonial.content + '</p>';
    
    var author = '<div class="cd-author"></div>';
    var avatar = '<img src="/media/uploads/home/students/' + testimonial.avatar + '"/>';
    
    var authorInfo = '<div class="cd-author-info"></div>';
    var name = '<li>' + testimonial.name + '</li>';
    var title = '<li>' + testimonial.title + '</li>';
    authorInfo = $(authorInfo).append(name).append(title);
    
    author = $(author).append(avatar).append(authorInfo);
    
    return $(testimonialElement).append(content).append(author);
}

//teacher select
function selectTeacher(teacher) {
    blockSelect = true;
    $('.selected').removeClass('selected');
    var frame = $('.teacher-select[data-teacher=' + teacher + ']')
    frame.addClass('selected');
    var teacher = frame.data('teacher');
    $('.teacher-detail').fadeOut(200);
    setTimeout(function () {
        $('.teacher-detail[data-teacher=' + teacher + ']').fadeIn(300);
        blockSelect = false;
    }, 300);
}

//global var for blocking select teacher
var blockSelect = false;

$(function () {
	var bannerHeight = $('#main-banner').height();
	var contentStartHeight = $('#content-start').height();
	var contentStartPos = bannerHeight + contentStartHeight;
	var showingLogo = false;
	var floatingLogo = $('#floating-logo');
	function onScroll(){
		var currentPos = window.pageYOffset;
		if (currentPos < contentStartPos){
			floatingLogo.css('margin-top', '40px');
			floatingLogo.css('top', contentStartPos - currentPos);
		} else {
			floatingLogo.css('top', 0);
			floatingLogo.css('margin-top', '10px');
		}
		if (currentPos < bannerHeight){
			showingLogo = false;
			floatingLogo.fadeOut(300);;
		} else if(!showingLogo){
			showingLogo = true;
			floatingLogo.fadeIn(500);
		}
	}
	onScroll();

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

    //for displaying special form inputs
    $(".wday").weekLine({
        theme: 'jquery-ui',
        dayLabels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        onChange: function () {
            $(this).next().val($(this).weekLine('getSelected', 'indexes'));
        },
    });

    $(".time_from").timepickr({
        convention: 24,
    });
    $(".time_to").timepickr({
        convention: 24,
    });
	
	//submit form
    $(".submit-btn").click(function (e) {
        e.preventDefault();
        var button = $(this);
        var validator = window[button.data('validator')];
        var form = $('#' + button.data('form'));
        if (validator.call(this, form)) {
			register(form.serialize());
        }
        return false;
    });
	
	//modal popup
	var showingModal = false;
	var modalForm = new BootstrapDialog({
		autodestroy:true,
		message: function(){
			var cloneForm = $('#main-form').clone().attr('id', 'clone-form');
			cloneForm.find('.registration-form').attr('id', 'clone-registration-form');
			cloneForm.find('.submit-btn').attr('data-form', 'clone-registration-form');
			
			return cloneForm;
		},
	});
	modalForm.realize();
	modalForm.getModalHeader().hide();
    var content = modalForm.getModalContent();
    content.css('border', 'none');
    content.css('box-shadow', 'none');
	content.css('background-color','rgba(255,255,255,0)');
	content.width(0);
	content.css('margin-top','60px');
	modalForm.getModalFooter().hide();
	
	//reset header to normal state
	$(document).on('hidden.bs.modal', function () {
		showingModal = false;
		$('#body-header').css('width', '100%');
	});
	
	//always adapt to screen width
	//prevent it from stretching when modal is shown
	window.onresize = function(){
		if (showingModal){
			$('#body-header').width($(document).width());
		} else {
			$('#body-header').css('width', '100%');
		}
	}
	
	//trigger form
	$('.form-trigger').click(function(e){
		e.preventDefault();
		showingModal = true;
		//prevent header spreading to full width on modal show
		$('#body-header').width($(document).width());
        
        var triggerer = $(this);
        if (triggerer.hasClass('slow-teleporter')){
            var waypoint = $('#' + triggerer.data('waypoint'));
            modalForm.getModal().on('hidden.bs.modal', function(){
                jump(waypoint);
                $(this).off();
            });
        } else {
            modalForm.getModal().unbind('hidden.bs.modal');
        }

		var formBody = modalForm.getModalBody();
        
        var closeBtn = formBody.find('.close-button');
        closeBtn.show();
        closeBtn.children('a').click(function(e){
            e.preventDefault();
            modalForm.close();
        });
        
		//submit button for modal popup
		formBody.find(".submit-btn").click(function(e){
			e.preventDefault();
			var button = $(this);
			var validator = window[button.data('validator')];
			var form = $('#' + button.data('form'));
			if (validator.call(this, form)) {
				register(form.serialize());
			}
			return false;
		});
		
		formBody.find('.wday').html("");
		formBody.find(".wday").weekLine({
			theme: 'jquery-ui',
			dayLabels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
			onChange: function () {
				$(this).next().val($(this).weekLine('getSelected', 'indexes'));
			},
		});
		
		var timeFrom = formBody.find(".time_from");
		timeFrom.next().remove();
		timeFrom.timepickr({
			convention: 24,
		});
		var timeTo = formBody.find(".time_to");
		timeTo.next().remove();
		timeTo.timepickr({
			convention: 24,
		});
        
		modalForm.open();
	});
	
	$(window).bind('scroll', function(){
		onScroll();
	});
    
    //populate data
    populateTeachers('teacher', teachers);
    populateTestimonials('testimonial-container', testimonials);
    
    //select first teacher when enter page
    var firstFrame = $('#teacher').find('.teacher-list').children().first();
    selectTeacher(firstFrame.data('teacher'));

    //change teacher on click
    $('.teacher-select').click(function () {
        if (!blockSelect){
            selectTeacher($(this).data('teacher'));
        }
    });
});

//tawk api
var $_Tawk_API = {}, $_Tawk_LoadStart = new Date();
(function () {
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/55a6150d84d307454c0158a3/default';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
})();

var html5lightbox_options = {
    watermark: "Speak up - Học tiếng Anh online",
    watermarklink: "https://speakup.vn/news",
};


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