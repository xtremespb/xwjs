var window_resize_handler = function() {
	$('.xwjs-admin-content').css("min-height", ($(window).innerHeight() - $('.xwjs-admin-navbar').height() - 2) + 'px');
};

$(document).ready(function() {
	window_resize_handler();
	$(window).resize(window_resize_handler);
});
