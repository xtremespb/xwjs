module.exports = function(app) {
    var path = require("path"),
        router_api = require(path.join(__dirname, "./api.js"))(app);
    return {
        api: {
            prefix: "/api/captcha",
            router: router_api
        }
    };

};
