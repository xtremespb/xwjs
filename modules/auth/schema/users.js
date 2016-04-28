var path = require("path"),
    config = require(path.join("..", "..", "..", "etc", "config")),
    orm = require(path.join("..", "..", "..", "core", "orm"));

users = orm.define(config.prefix + "_users", {
    id: { type: orm.Integer, unique: true },
    username: { type: orm.String, limit: 40, unique: true, index: true },
    password: { type: orm.String, limit: 64, index: true },
    email: { type: orm.String, limit: 80 },
    status: { type: orm.Integer, limit: 3, default: 0, index: true }
}, {});

module.exports = users;
