var logger = require('intel'),
	path = require('path'),
    config = require(path.join('..', 'etc', 'config'));

logger.setLevel(config.logging.level);
if (config.logging.console) logger.addHandler(new logger.handlers.Console(config.logging.options.console));
logger.addHandler(new logger.handlers.File(config.logging.options.file));

module.exports = logger;
