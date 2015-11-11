function populateTestimonials(divId, testimonials){
    var container = $('#' + divId);
    if (!container || container.hasClass('ready')){
        return;
    }

    var randomTestimonials = randomSubArray(testimonials, 10);
    
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
    
    container.append(frontPageDiv).append(allTestimonialDiv).addClass('ready');
    
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

$(document).ready(function(){
    populateTestimonials('testimonial-container', testimonials);

    TestimonialSlider.show('.cd-testimonials-wrapper', {
        selector: ".cd-testimonials > li",
        animation: "slide",
        controlNav: false,
        slideshow: true,
        smoothHeight: false,
        itemWidth: 447.5,
        itemMargin: 0,
        minItems: 2,
        maxItems: 2,
        start: function(){
            $('.cd-testimonials').children('li').css({
                'opacity': 1,
                'position': 'relative'
            });
        }
    });
})