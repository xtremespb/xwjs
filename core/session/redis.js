module.exports = function(app) {
	var driver = function(config, session) {
		var RedisStore = require('connect-redis')(session);
		config.session.store.settings.prefix = config.prefix + "_session_";
		config.session.store.settings.ttl = config.session.ttl;
		config.session.settings.store = new RedisStore(config.session.store.settings);
	};
	return driver;
};