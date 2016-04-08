var express = require('express'),
    app = express().set('express', express),
    session = require('express-session'),
    path = require('path'),
    fs = require('fs'),
    default_routes = require(path.join(__dirname, 'default_routes'))(app),
    config = require(path.join('..', 'etc', 'config'));

/* Initialize session engine */
var session_driver = require(path.join(__dirname, 'session', config.session.store.name))(app);
session_driver(config, session);
app.use(session(config.session.settings));

/* Load "first" route */
app.use(default_routes.first);

/* Load modules */
var modules = fs.readdirSync(path.join(__dirname, '..', 'modules'));
for (var mt in modules) {
	if (!fs.lstatSync(path.join(__dirname, '..', 'modules', modules[mt])).isDirectory()) {
		modules.splice(mt);
		continue;
	}
	var module_load = require(path.join(__dirname, '..', 'modules', modules[mt], 'module'))(app);
	if (module) app.use(module_load.prefix, module_load.router);
}

/* Load error handling routes */
app.use(default_routes.notFound).use(default_routes.errorHandler);

module.exports = app;
