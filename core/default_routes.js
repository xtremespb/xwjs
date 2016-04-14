module.exports = function(app) {
    var path = require("path"),
        te = require(path.join(__dirname, "template_engine"))(app),
        logger = require(path.join(__dirname, "logger")),
        i18n = require(path.join(__dirname, "i18n"))(app);

    i18n.init();
    te.init(path.join(__dirname, "..", "views"));

    var default_routes = {
        first: function(req, res, next) {
            logger.debug(req.ip + " " + req.method + " " + req.originalUrl);
            if (!req.session) {
                var err = new Error("Internal server error (session engine not connected)");
                err.status = 500;
                return next(err);
            }
            next();
        },
        notFound: function(req, res, next) {
            i18n.detect_locale(req);
            var err = new Error(i18n.get().__("The page you are trying to reach does not exist, or has been moved"));
            err.status = 404;
            next(err);
        },
        errorHandler: function(err, req, res, next) {
            i18n.detect_locale(req);
            if (!err.status) err.status = 500;
            var config = app.get("config"),
                config_website = app.get("config_website");
            var log_message = req.ip + " " + req.method + " " + req.originalUrl + " [" + err.status + "] " + err.message;
            if (err.status != 404) {
                logger.error(log_message);
            } else {
                logger.debug(log_message);
            }
            res.status(err.status);
            te.get().render("error.njk", {
                config: config,
                config_website: config_website,
                lang: i18n.get().getLocale(),
                title: i18n.get().__("Error") + " (" + err.status + ")",
                error: err
            }, function(err, html) {
                if (err) {
                    logger.error(err);
                    throw err;
                }
                res.send(html);
            });
        }
    };
    return default_routes;
};
