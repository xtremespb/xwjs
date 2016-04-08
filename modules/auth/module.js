module.exports = function(app) {
    var router = app.get('express').Router(),
        path = require("path"),
        logger = require(path.join("..", "..", "core", "logger"));
    router.get('/', function(req, res) {
        req.session.medved = 123;
        return res.send("OK");
    });
    return {
        prefix: "/api/auth",
        router: router
    };
};
