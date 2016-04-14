module.exports = function(app) {
    var path = require("path"),
    	Captcha = require(path.join('..', '..', 'core', 'captcha'));

    var image = function(req, res, next) {
        var captcha = new Captcha();
        captcha.generate(function(data) {
            res.setHeader('Content-Type', data.mime);
            req.session.captcha = data.code;
            return res.send(data.buffer);
        });
    };

    var router = app.get("express").Router();
    router.get("/image", image);

    return {
        router: router,
        methods: {
        }
    };
};
