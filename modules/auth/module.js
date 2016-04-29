module.exports = function(app) {
    var path = require("path"),
        preroutes = require(path.join(__dirname, "./preroutes.js"))(app),
        router_frontend = require(path.join(__dirname, "./frontend.js"))(app),
        router_api = require(path.join(__dirname, "./api.js"))(app);

    return {
        preroutes: preroutes,
        frontend: {
            prefix: "/auth",
            data: router_frontend
        },
        api: {
            prefix: "/api/auth",
            data: router_api
        }
    };

};
