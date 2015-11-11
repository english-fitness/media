var teacherSelect = {
    block: false,
    currentTeacher:null,
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
    
    var avatar = '<img class="teacher-icon" src="'+baseAssetsUrl+'/uploads/home/teachers/' + teacher.avatar + '"/>'
    var frameWrapper = $('<div class="teacher-frame"></div>').append(avatar);
    var listItem = $('<li class="teacher-select" data-teacher="' + id + '"></li>').append(frameWrapper);
    
    teacherList.append(listItem);
    
    var teacherContainer = teacherDiv.find('#tv-screen');
    
    var teacherDetail = $('<div class="teacher-detail" data-teacher="' + id + '"></div>');
    
    var thumbnailImg = '<img src="' + teacher.videoThumbnail + '"/>';
    var thumbnail = $('<div class="vid-thumbnail"></div>').append(thumbnailImg);
    var lightbox = $('<a href="' + teacher.video + '" class="html5lightbox"></a>').append(thumbnail);
    var teacherVideo = $('<div class="teacher-video"></div>').append(lightbox);
    
    var teacherInfo = $('<div class="teacher-info accent"></div>');
    
    teacherDetail.append(teacherVideo);
    
    teacherContainer.append(teacherDetail);
}

function bindTeacherButtons(){
    $(".teacher-select").click(function(){
        if (!teacherSelect.block && teacherSelect.currentTeacher != this.getAttribute('data-teacher')){
            selectTeacher(this.getAttribute('data-teacher'));
        }
    });
    $('#tv-btn > .btn').click(function(e){
        e.preventDefault();
        if ($(this).hasClass('prev')){
            var direction = 'prev';
        } else {
            var direction = 'next';
        }

        tvButtonClick(direction);
    });

    //select first teacher
    var firstTeacher = $('#teachers-container > .teacher-list').children().first().data('teacher');
    selectTeacher(firstTeacher);
}

function selectTeacher(teacher){
    teacherSelect.block = true;
    teacherSelect.currentTeacher = teacher;
    var list = $('#teachers-container > .teacher-list');
    list.find('.selected').removeClass('selected');
    var frame = list.find('.teacher-select[data-teacher=' + teacher + ']');
    frame.addClass('selected');
    var teacher = frame.data('teacher');
    $('.teacher-detail').fadeOut(200);
    setTimeout(function () {
        $('.teacher-detail[data-teacher=' + teacher + ']').fadeIn(300);
        teacherSelect.block = false;
    }, 300);
}

function tvButtonClick(direction){
    teacherSelect.block = true;
    var listTeacher = $('#teachers-container > .teacher-list');
    var selected = listTeacher.find('.selected');
    selected.removeClass('.selected');
    if (direction == 'next'){
        if (selected.is(':last-child')){
            var nextTeacher = listTeacher.children().first();
        } else {
            var nextTeacher = selected.next();
        }
    } else {
        if (selected.is(':first-child')){
            var nextTeacher = listTeacher.children().last();
        } else {
            var nextTeacher = selected.prev();
        }
    }
    selectTeacher(nextTeacher.data('teacher'));
}

function bindFormInputs(){
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
}

function bindFloatingButton(){
    var line = $('#steps').offset().top;
    document.onscroll = function(){
        if (window.pageYOffset >= line){
            $('#floating-btn').show(300);
        } else {
            $('#floating-btn').hide(300);
        }
    }
}

$(document).ready(function(){
    populateTeachers('teachers-container', teachers);
    bindTeacherButtons();
    bindFormInputs();
    bindFloatingButton();
})