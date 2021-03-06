/* Required modules */

var express = require('express'),
    app = express().set('express', express),
    session = require('express-session'),
    path = require('path'),
    fs = require('fs'),
    deepcopy = require("deepcopy"),
    logger = require('./logger'),
    cookie_parser = require('cookie-parser'),
    body_parser = require('body-parser'),
    default_routes = require(path.join(__dirname, 'default_routes'))(app),
    config = require(path.join(__dirname, '..', 'etc', 'config')),
    config_website = require(path.join(__dirname, '..', 'etc', 'website'));

/* Initialize cookie and body parsers */

app.use(cookie_parser(config.session.settings.secret));
app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended: true
}));

/* Initialize session engine */
var session_driver = require(path.join(__dirname, 'session', config.session.store.name))(app);
session_driver(config, session);
app.use(session(config.session.settings));

/* Initialize static folder */
app.use(express.static(path.join(__dirname, '..', 'static')));

/* Check database connection */
app.use(default_routes.database);

/* Load "first" route */
app.use(default_routes.first);

/* Modules */
var modules = fs.readdirSync(path.join(__dirname, '..', 'modules')),
    modules_process = deepcopy(modules),
    methods = {};

/* Loading preroutes */
for (var mt in modules_process) {
    if (!fs.lstatSync(path.join(__dirname, '..', 'modules', modules_process[mt])).isDirectory()) continue;
    var module_load = require(path.join(__dirname, '..', 'modules', modules_process[mt], 'module'))(app);
    if (module_load && module_load.preroutes)
        for (var p in module_load.preroutes)
            app.use(module_load.preroutes[p]);
}

/* Loading routes and methods */
for (var mt in modules_process) {
    if (!fs.lstatSync(path.join(__dirname, '..', 'modules', modules_process[mt])).isDirectory()) {
        modules.splice(mt);
        continue;
    }
    var module_load = require(path.join(__dirname, '..', 'modules', modules_process[mt], 'module'))(app);
    if (module_load) {
        if (module_load.api) {
            if (module_load.api.data.router) app.use(module_load.api.prefix, module_load.api.data.router);
            for (var property in module_load.api.data.methods) {
                if (module_load.api.data.methods.hasOwnProperty(property)) {
                    methods[property] = module_load.api.data.methods[property];
                }
            }
        }
        if (module_load.backend) {
            if (module_load.backend.data.router) app.use(module_load.backend.prefix, module_load.backend.data.router);
            for (var property in module_load.backend.data.methods) {
                if (module_load.backend.data.methods.hasOwnProperty(property)) {
                    methods[property] = module_load.backend.data.methods[property];
                }
            }
        }
        if (module_load.frontend) {
            if (module_load.frontend.data.router) app.use(module_load.frontend.prefix, module_load.frontend.data.router);
            for (var property in module_load.frontend.data.methods) {
                if (module_load.frontend.data.methods.hasOwnProperty(property)) {
                    methods[property] = module_load.frontend.data.methods[property];
                }
            }
        }
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

/* Set variables */

app.set("config", config);
app.set("config_website", config_website);
app.set("methods", methods);

/* Load error handling routes */
app.use(default_routes.notFound).use(default_routes.errorHandler);

module.exports = app;
