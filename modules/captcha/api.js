module.exports = function(app) {
    var path = require("path"),
        router = app.get('express').Router(),
    	Captcha = require(path.join('..', '..', 'core', 'captcha'));
    router.get("/image", function(req, res, next) {
        var captcha = new Captcha();
        captcha.generate(function(data) {
            res.setHeader('Content-Type', data.mime);
            req.session.captcha = data.code;
            return res.send(data.buffer);
        });
    });
    return router;
};
