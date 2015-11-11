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
    
    var portraitHolder = teacherDiv.find('#portrait-holder');
    
    var avatar = '<img class="teacher-portrait" src="/media/uploads/home/teachers/' + teacher.avatar + '"/>'
    var portrait = $('<div class="portrait" data-teacher="'+id+'"></div>').append(avatar);
    
    portraitHolder.append(portrait);
    
    var teacherContainer = teacherDiv.find('#teacher-container');
    
    var teacherProfile = $('<div class="teacher-profile" data-teacher="' + id + '"></div>');

    var teacherInfo = $('<div class="teacher-info"></div>');
    
    var name = '<div class="info name"><p><b>Giáo viên: </b>' + teacher.name + '</p></div>';
    var location = '<div class="info location"><p><b>Nơi ở: </b>' + teacher.location + '</p></div>';
    var education = '<div class="info style"><p><b>Học vấn: </b>' + teacher.education + '</p></div>';
    var achievements = '<div class="info achievement"><p><b>Thành tích: </b>' + teacher.achievements + '</p></div>';

    teacherInfo.append(name).append(location).append(education).append(achievements);

    var thumbnailImg = '<img src="' + teacher.videoThumbnail + '"/>';
    var thumbnail = $('<div class="vid-thumbnail"></div>').append(thumbnailImg);
    var lightbox = $('<a href="' + teacher.video + '" class="html5lightbox"></a>').append(thumbnail);
    var teacherVideo = $('<div class="teacher-video"></div>').append(lightbox);
    
    teacherProfile.append(teacherInfo).append(teacherVideo);
    
    teacherContainer.append(teacherProfile);
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
function selectTeacher(teacher, direction) {
    blockSelect = true;
    var selected = $('.selected');
    if (direction == 'left'){
        var slideIn = 'right';
        var slideOut = 'left'
    } else {
        var slideIn = 'left';
        var slideOut = 'right'
    }
    if (selected.length > 0){
        $('.selected').removeClass('selected').hide('slide', {direction:slideOut}, 350).promise().done(function(){
            $('.portrait[data-teacher=' + teacher + ']').addClass('selected').show('slide', {direction:slideIn}, 450);
        });
    } else {
        $('.portrait[data-teacher=' + teacher + ']').addClass('selected').show('slide', {direction:slideIn}, 450);
    }
    $('.teacher-profile').fadeOut(350);
    setTimeout(function () {
        $('.teacher-profile[data-teacher=' + teacher + ']').fadeIn(450);
        blockSelect = false;
    }, 450);
}

function slideTeacher(direction){
    var portraitHolder = $('#portrait-holder');
    var currentTeacher = portraitHolder.find(".selected");
    if (direction == 'left'){
        if (currentTeacher.is(':first-child')){
            var nextTeacher = currentTeacher.parent().children().last().data('teacher');
        } else {
            var nextTeacher = currentTeacher.prev().data('teacher');
        }
    } else if (direction == 'right'){
        if (currentTeacher.is(':last-child')){
            var nextTeacher = currentTeacher.parent().children().first().data('teacher');
        } else {
            var nextTeacher = currentTeacher.next().data('teacher');
        }
    }
    selectTeacher(nextTeacher, direction);
}

//global var for blocking select teacher
var blockSelect = false;

//Ready, set, go
$(function () {
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

	//submit form
    $(".submit-btn").click(function (e) {
        e.preventDefault();
        var button = $(this);
        var validator = window[button.data('validator')];
        var form = $('#' + button.data('form'));
        if (validator.call(this, form)) {
			quickRegister(form.serialize());
        }
        return false;
    });
	
	//trigger form
	$('.form-trigger').click(function(e){
		e.preventDefault();
		popupForm();
	});

    //populate data
    populateTeachers('teacher', teachers);
    populateTestimonials('testimonial-container', testimonials);
    
    //select first teacher when enter page
    var firstFrame = $('#teacher').find('#portrait-holder').children().first();
    selectTeacher(firstFrame.data('teacher'));

    //change teacher on click
    $("#teacher-slider .slide").click(function(){
        if (!blockSelect){
            var $this = $(this);
            if ($this.hasClass('left')){
                var direction = 'left';
            } else if ($this.hasClass('right')){
                var direction = 'right';
            }
            slideTeacher(direction);
        }
    });
    $("#teacher-slider").swiperight(function(e){
        slideTeacher('right');
    });
    $("#teacher-slider").swipeleft(function(e){
        slideTeacher('left');
    });

    TestimonialSlider.show('.cd-testimonials-wrapper', {
        selector: ".cd-testimonials > li",
        animation: "slide",
        controlNav: false,
        slideshow: true,
        smoothHeight: true,
        minItems: 1,
        maxItems: 1,
        start: function(){
            $('.cd-testimonials').children('li').css({
                'opacity': 1,
                'position': 'relative'
            });
        }
    });

});

$(window).load(function(){
    $('.ui-loader').remove();
})

var html5lightbox_options = {
    watermark: "Speak up - Học tiếng Anh online",
    watermarklink: "/news",
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