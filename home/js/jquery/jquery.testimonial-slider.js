jQuery(document).ready(function($){
	//create the slider
	$('.cd-testimonials-wrapper').flexslider({
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

	//open the testimonials modal page
	$('.cd-see-all').on('click', function(e){
		e.preventDefault();
		$('.cd-testimonials-all').addClass('is-visible');
	});

	//close the testimonials modal page
	$('.cd-testimonials-all .close-btn').on('click', function(e){
		e.preventDefault();
		$('.cd-testimonials-all').removeClass('is-visible');
	});
	$(document).keyup(function(event){
		//check if user has pressed 'Esc'
    	if(event.which=='27'){
    		$('.cd-testimonials-all').removeClass('is-visible');	
	    }
    });
    
	//build the grid for the testimonials modal page
	$('.cd-testimonials-all-wrapper').children('ul').masonry({
  		itemSelector: '.cd-testimonials-item'
	});
    
    var wrapper = $('.cd-testimonials-all-wrapper');
    var height = wrapper.height();
    var scrollHeight = wrapper.get(0).scrollHeight;
    var diff = scrollHeight - height;
    
    wrapper.bind('mousewheel', function(e){
        var delta = e.originalEvent.wheelDelta;
        if ((this.scrollTop === diff && delta < 0) || (this.scrollTop === 0 && delta > 0)){
            e.preventDefault();
        }
    });
});