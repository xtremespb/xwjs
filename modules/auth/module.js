module.exports = function(app) {
    var path = require("path"),
        config = require(path.join('..', '..', 'etc', 'config')),
        logger = require(path.join("..", "..", "core", "logger")),
        orm = require(path.join("..", "..", "core", "orm")),
        Users = require(path.join(__dirname, 'schema', 'users')),
        router_frontend = require(path.join(__dirname, "./frontend.js"))(app),
        router_backend = require(path.join(__dirname, "./backend.js"))(app),
        router_api = require(path.join(__dirname, "./api.js"))(app);

    return {
        frontend: {
            prefix: "/auth",
            router: router_frontend
        },
        backend: {
            prefix: "/admin/auth",
            router: router_backend
        },
        api: {
            prefix: "/api/auth",
            router: router_api
        }
    };

};
