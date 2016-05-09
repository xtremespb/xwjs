module.exports = function(app) {
    var path = require("path"),
        template_engine = require(path.join(__dirname, "..", "..", "core", "template_engine"))(app),
        i18n = require(path.join(__dirname, "..", "..", "core", "i18n"))(app);
    i18n.init("auth");
    template_engine.init(path.join(__dirname, "views"));
    var backend = function(req, res, callback) {
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
            callback(html);
        });
    };
    return backend;
};
