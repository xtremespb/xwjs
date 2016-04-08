var express = require('express'),
    app = express().set('express', express),
    session = require('express-session'),
    path = require('path'),
    fs = require('fs'),
    deepcopy = require("deepcopy"),
    logger = require('./logger'),
    default_routes = require(path.join(__dirname, 'default_routes'))(app),
    config = require(path.join('..', 'etc', 'config'));

/* Initialize session engine */
var session_driver = require(path.join(__dirname, 'session', config.session.store.name))(app);
session_driver(config, session);
app.use(session(config.session.settings));

/* Initialize static folder */
app.use(express.static(path.join(__dirname, '..', 'static')));

/* Load "first" route */
app.use(default_routes.first);

/* Load modules */
var modules = fs.readdirSync(path.join(__dirname, '..', 'modules')),
    modules_process = deepcopy(modules);
for (var mt in modules_process) {
    if (!fs.lstatSync(path.join(__dirname, '..', 'modules', modules_process[mt])).isDirectory()) {
        modules.splice(mt);
        continue;
    }
    var module_load = require(path.join(__dirname, '..', 'modules', modules_process[mt], 'module'))(app);
    if (module) {
        app.use(module_load.prefix, module_load.router);
        try {
            var static_path = path.join(__dirname, '..', 'modules', modules_process[mt], 'static'),
                static_lstat = fs.lstatSync(path.join(static_path));
            if (static_lstat && static_lstat.isDirectory()) {
            	app.use(express.static(static_path));
            } else {
            	throw true;
            }
        } catch (e) {
            logger.debug("No static folder for module: " + modules_process[mt]);
        }
    }
}

/* Load error handling routes */
app.use(default_routes.notFound).use(default_routes.errorHandler);

module.exports = app;
