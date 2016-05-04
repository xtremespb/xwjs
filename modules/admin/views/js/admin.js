var window_resize_handler = function() {
	$('.xwjs-logo-img').css("padding-left", ($('.xwjs-nav-side').width() / 2 - $('.xwjs-logo-img').width() / 2) + 'px' );
	$('.xwjs-admin-content').css("min-height", ($(window).innerHeight() - $('.xwjs-admin-navbar').height()) + 'px');
};

$(document).ready(function() {
	window_resize_handler();
	$(window).resize(window_resize_handler);
});
