module.exports = function(app) {
    var path = require("path"),
        fs = require("fs-extra"),
        async = require("async"),
        router = app.get("express").Router(),
        template_engine = require(path.join(__dirname, "..", "..", "core", "template_engine"))(app),
        logger = require(path.join(__dirname, "..", "..", "core", "logger")),
        i18n = require(path.join(__dirname, "..", "..", "core", "i18n"))(app);

    i18n.init("admin");
    template_engine.init(path.join(__dirname, "views"));

    var modules = fs.readdirSync(path.join(__dirname, "..")),
        backends = {},
        backends_json_arr = [],
        backends_jsons = {};

    for (var m in modules) {
        if (!fs.lstatSync(path.join(__dirname, "..", modules[m])).isDirectory() || modules[m] == "admin" || backends[modules[m]]) continue;
        try {
            var backend_file = path.join(__dirname, "..", modules[m], "backend.js");
            fs.accessSync(backend_file, fs.F_OK);
            backends[modules[m]] = require(backend_file)(app);
            var backend_json_file = path.join(__dirname, "..", modules[m], "backend.json");
            fs.accessSync(backend_json_file, fs.F_OK);
            var backend_json = fs.readJsonSync(backend_json_file, { throws: true });
            backends_json_arr.push(backend_json);
            backends_jsons[modules[m]] = backend_json;
        } catch (e) {
            // OK, ignore
        }
    }

    var admin = function(req, res, next) {
        var auth = req.session.auth_data;
        if (!auth || auth.status < 1) return res.redirect(303, "/auth/login?redirect=/admin&rnd=" + Math.random().toString().replace(".", ""));
        if (auth.status < 2) return res.redirect(303, "/auth/login?rnd=" + Math.random().toString().replace(".", ""));
        if (req.params && req.params[0] && !backends[req.params[0].toLowerCase()]) {
            var err = new Error(i18n.get().__("pagenotfound"));
            err.status = 404;
            return next(err);
        }
        var backend_html, current_backend;
        async.series([
            function(callback) {
                if (req.params && backends[req.params[0]]) {
                    current_backend = req.params[0].toLowerCase();
                    backends[current_backend](req, res, function(data) {
                        backend_html = data;
                        callback();
                    });
                } else {
                    callback();
                }
            },
            function(callback) {
                i18n.detect_locale(req);
                var backend_data = {
                    "id": "home",
                    title: {},
                    "icon": "home"
                };
                if (backends_jsons[current_backend]) {
                    backend_data = backends_jsons[current_backend];
                } else {
                    backend_data.title[i18n.get().getLocale()] = i18n.get().__("admin_panel");
                }
                var config = app.get("config"),
                    config_website = app.get("config_website");
                template_engine.get().render("admin.njk", {
                    config: config,
                    config_website: config_website,
                    i18n: i18n.get(),
                    lang: i18n.get().getLocale(),
                    backend_html: backend_html,
                    backend_data: backend_data,
                    backend_json: backends_json_arr,
                    auth: auth
                }, function(err, html) {
                    if (err) {
                        logger.error(err);
                        throw err;
                    }
                    res.send(html);
                    callback();
                });
            }
        ]);
    };

    router.get("/", admin);
    router.get("/*", admin);

    return {
        router: router,
        methods: {}
    };
};
