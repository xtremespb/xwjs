module.exports = function(app) {
    var path = require("path"),
        config = require(path.join("..", "etc", "config")),
        config_website = require(path.join(__dirname, "..", "etc", "website")),
        i18nm,
        i18n = {
            init: function(module) {
                var dir = path.join(__dirname, "..", "core", "lang");
                if (module) dir = path.join(__dirname, "..", "modules", module, "lang");
                i18nm = new(require('i18n-2'))({
                    locales: config_website.locales.avail,
                    directory: dir,
                    extension: '.json',
                    devMode: config_website.locales.dev_mode
                });
            },
            detect_locale: function(req) {
                if (config_website.locales.source.session) i18nm.setLocaleFromSessionVar(req);
                if (config_website.locales.source.cookie) i18nm.setLocaleFromCookie(req);
                if (config_website.locales.source.subdomain) i18nm.setLocaleFromSubdomain(req);
                if (config_website.locales.source.query) i18nm.setLocaleFromQuery(req);
                req.session.lang = i18nm.getLocale();
            },
            get: function() {
                return i18nm;
            }
        };
    return i18n;
};
