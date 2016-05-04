module.exports = function(app) {
    var path = require("path"),
        router_frontend = require(path.join(__dirname, "./frontend.js"))(app),
        router_api = require(path.join(__dirname, "./api.js"))(app);

    return {
        frontend: {
            prefix: "/admin",
            data: router_frontend
        },
        api: {
            prefix: "/api/auth",
            data: router_api
        }
    };

};
