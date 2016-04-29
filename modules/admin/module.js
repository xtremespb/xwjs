module.exports = function(app) {
    var path = require("path"),
        router_backend = require(path.join(__dirname, "./backend.js"))(app),
        router_api = require(path.join(__dirname, "./api.js"))(app);

    return {
        backend: {
            prefix: "/admin",
            data: router_backend
        },
        api: {
            prefix: "/api/auth",
            data: router_api
        }
    };

};
