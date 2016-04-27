var update_captcha = function() {
	$(this).attr("src", "/api/captcha/image?timestamp=" + new Date().getTime());
};

$(document).ready(function() {
	$('#auth_username').focus();
	$('.xwjs-login-captcha-img').click(update_captcha);
	$('.xwjs-login-captcha-img').click();
});