var path = require("path"),
    logger = require(path.join(__dirname, "..", "logger"));

module.exports = function(app) {
    var log = function(msg) {
            logger.debug(msg);
        },
        driver = function(config, session) {
            var FileStore = require('session-file-store')(session);
            config.session.store.settings.prefix = config.prefix + "_session_";
            config.session.store.settings.ttl = config.session.ttl;
            config.session.store.settings.logFn = log;
            config.session.settings.store = new FileStore(config.session.store.settings);
        };
    return driver;
};
