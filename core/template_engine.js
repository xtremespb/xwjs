module.exports = function(app) {
    var nunjucks = require("nunjucks"),
        env,
        methods_load,
        te = {
            init: function(path) {
                env = new nunjucks.Environment(new nunjucks.FileSystemLoader(path));
            },
            get: function() {
                var methods = app.get("methods");
                if (!methods_load) {
                    Object.keys(methods).forEach(function(key) {
                        env.addFilter(key, methods[key], true);
                    });
                    methods_load = true;
                }
                return env;
            },
            get_: function() {
                return env;
            }
        };
    return te;
};
