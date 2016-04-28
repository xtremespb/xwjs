module.exports = function(app) {
    var path = require("path"),
        template_engine = require(path.join(__dirname, "..", "..", "core", "template_engine"))(app),
        logger = require(path.join(__dirname, "..", "..", "core", "logger")),
        i18n = require(path.join(__dirname, "..", "..", "core", "i18n"))(app);

    i18n.init("auth");
    template_engine.init(path.join(__dirname, "views"));

    var login = function(req, res, next) {
            if (req.session && req.session.auth_id) return res.redirect(303, "/?rnd=" + Math.random().toString().replace('.', ''));
            i18n.detect_locale(req);
            var config = app.get("config"),
                config_website = app.get("config_website");
            template_engine.get().render("login.njk", {
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

        },
        logout = function(req, res, next) {
            if (req.session && req.session.auth_id) {
                delete req.session.auth_id;
                return res.redirect(303, "/?logout=" + Math.random().toString().replace('.', ''));
            } else {
                return res.redirect(303, "/auth/login?rnd=" + Math.random().toString().replace('.', ''));
            }
        };


    var router = app.get("express").Router();
    router.get("/login", login);
    router.get("/logout", logout);

    return {
        router: router,
        methods: {}
    };
};
