module.exports = function(app) {
    var nunjucks = require("nunjucks"),
        env,
        methods_load,
        methods = function() {
            if (!methods_load) {
                var methods = app.get("methods");
                Object.keys(methods).forEach(function(key) {
                    env.addFilter(key, methods[key], true);
                });
                methods_load = true;
            }
        },
        te = {
            init: function(path) {
                env = new nunjucks.Environment(new nunjucks.FileSystemLoader(path));
            },
            get: function() {
                methods();
                return env;
            },
            get_: function() {
                return env;
            }
        };
    return te;
};
