module.exports = function(app) {
    var path = require("path"),
        router = app.get("express").Router(),
        template_engine = require(path.join(__dirname, "..", "..", "core", "template_engine"))(app),
        logger = require(path.join(__dirname, "..", "..", "core", "logger")),
        i18n = require(path.join(__dirname, "..", "..", "core", "i18n"))(app);

    i18n.init("admin");
    template_engine.init(path.join(__dirname, "views"));

    var admin = function(req, res, next) {
    	var auth = app.get("auth");
        if (!auth || auth.status < 1) return res.redirect(303, "/auth/login?redirect=/admin&rnd=" + Math.random().toString().replace('.', ''));
        if (auth.status < 2) return res.redirect(303, "/auth/login?rnd=" + Math.random().toString().replace('.', ''));
        i18n.detect_locale(req);
        var config = app.get("config"),
            config_website = app.get("config_website");
        template_engine.get().render("admin.njk", {
            config: config,
            config_website: config_website,
            i18n: i18n.get(),
            lang: i18n.get().getLocale()
        }, function(err, html) {
            if (err) {
                logger.error(err);
                throw err;
            }
            res.send(html);
        });

    };

    router.get("/", admin);

    return {
        router: router,
        methods: {}
    };
};
