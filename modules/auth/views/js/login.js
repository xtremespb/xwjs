var update_captcha = function() {
        $(this).attr("src", "/api/captcha/image?timestamp=" + new Date().getTime());
    },
    enable_items_update_captcha = function() {
        $(".login-form-item").attr('disabled', false);
        $(".login-form-captcha-row").show();
        $(".login-form-loading").addClass("xwjs-hidden");
        $('.xwjs-login-captcha-img').click();
        $("#auth_captcha").val("");
    },
    validate_form = function() {
        $.validate({
            form: '#login_form',
            errorElementClass: "xwjs-form-danger",
            borderColorOnError: "",
            errorMessageClass: "xwjs-text-danger",
            onSuccess: function($form) {
                /* Disable items on form and show loader GIF */
                $(".login-form-item").attr('disabled', true);
                $(".login-form-captcha-row").hide();
                $(".login-form-loading").removeClass("xwjs-hidden");
                /* End: disable items on form and show loader GIF */
                $(".login-form-input").removeClass("xwjs-form-danger");
                $.ajax({
                        method: "POST",
                        url: "/api/auth/login",
                        data: {
                            username: $('#auth_username').val(),
                            password: $('#auth_password').val(),
                            captcha: $('#auth_captcha').val()
                        }
                    })
                    .done(function(data) {
                        if (!data || data.err_code !== 0) {
                            enable_items_update_captcha();
                            var err_msg, focus;
                            switch (data.err_code) {
                                case 10:
                                    err_msg = i18n.error_username;
                                    $("#auth_username").addClass("xwjs-form-danger").select().focus();
                                    break;
                                case 20:
                                    err_msg = i18n.error_password;
                                    $("#auth_password").addClass("xwjs-form-danger").val("").focus();
                                    break;
                                case 30:
                                case 40:
                                    err_msg = i18n.error_captcha;
                                    $("#auth_captcha").addClass("xwjs-form-danger").focus();
                                    break;
                                case 100:
                                    err_msg = i18n.error_unauthorized;
                                    $("#auth_password").addClass("xwjs-form-danger").val("");
                                    $("#auth_username").addClass("xwjs-form-danger").focus();
                                    break;
                                default:
                                    err_msg = i18n.error_unknown;
                                    $("#auth_username").focus();
                                    break;
                            }
                            UIkit.notify({
                                message: err_msg,
                                status: "danger",
                                timeout: 3000,
                                pos: "top-center"
                            });
                        } else {
                            location.href = $.getQuery().redirect || "/";
                        }
                    })
                    .fail(function() {
                        enable_items_update_captcha();
                        $("#auth_username").focus();
                        UIkit.notify({
                            message: i18n.error_unknown,
                            status: "danger",
                            timeout: 3000,
                            pos: "top-center"
                        });
                    });
                return false;
            }
        });
    },
    submit_form = function(e) {
        e.preventDefault();
    };

$(document).ready(function() {
    /* Focus on the primary item */
    $('#auth_username').focus();
    /* Set event handlers */
    $('.xwjs-login-captcha-img').click(update_captcha);
    $('.xwjs-login-captcha-img').click();
    $('#btn_login').click(validate_form);
    $('#login_form').submit(submit_form);
});
