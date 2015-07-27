var menuCloseTimer;

function onSubmenuHover(){
	if (menuCloseTimer)
		clearTimeout(menuCloseTimer);
	var submenu = $(this);
	if (submenu.hasClass('right-caret')){
		var parentMenu = submenu.parent().parent();
		var openingMenu = parentMenu.find('.left-caret');
		if (openingMenu){
			openingMenu.toggleClass('right-caret left-caret');
			openingMenu.next().hide();
		}
		submenu.toggleClass('right-caret left-caret');
		submenu.next().show();
	}
}
function onSubmenuHoverOut(){
	var submenu = $(this);
	var menuContainer = submenu.next();
	menuCloseTimer = setTimeout(function(){
		submenu.toggleClass('right-caret left-caret');
		menuContainer.hide();
	}, 300);
}

function onSubmenuItemHover(){
	if (menuCloseTimer)
		clearTimeout(menuCloseTimer);
}

$(function(){
	$(".dropdown-menu > li > a.trigger").hover(onSubmenuHover, onSubmenuHoverOut);
	$(".sub-menu > li > a").hover(onSubmenuItemHover);
	$(".dropdown-menu > li > a:not(.trigger)").on("click",function(){
		var root=$(this).closest('.dropdown');
		root.find('.left-caret').toggleClass('right-caret left-caret');
		root.find('.sub-menu:visible').hide();
	});
	$(".dropdown").on("hidden.bs.dropdown", function(){
		var dropdown = $(this);
		var openingSubmenu = dropdown.find('.left-caret');
		openingSubmenu.toggleClass('right-caret left-caret');
		openingSubmenu.next().hide();
	});
});