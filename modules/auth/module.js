module.exports = function(app) {
    var router = app.get('express').Router(),
        path = require("path"),
        logger = require(path.join("..", "..", "core", "logger")),
        orm = require(path.join("..", "..", "core", "orm"));
    router.get('/', function(req, res) {

        var Users = orm.define('user', {
            id: { type: orm.Integer, unique: true },
            username: { type: orm.String, limit: 40 },
            password: { type: orm.String, limit: 64 }
        }, {});

        var users = new Users();
        console.log(users);
        Users.create({username: 'medved', password: '3434'}, function(err) {
            console.log(err);
        });
        return res.send("OK");
    });
    return {
        prefix: "/api/auth",
        router: router
    };
};
