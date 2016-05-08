module.exports = function(app) {
    var path = require("path"),
        async = require("async"),
        indexes_ensured = false;

    var ensure_indexes = function(req, res, next) {
            if (indexes_ensured) return next();
            var config = app.get("config");
            async.series([
                function(callback) {
                    app.get("database").collection(config.prefix + "_users").ensureIndex({
                        username: 1
                    }, {
                        unique: true,
                        background: true,
                        w: 1
                    }, function(err, indexName) {
                        callback();
                    });
                },
                function(callback) {
                    app.get("database").collection(config.prefix + "_users").ensureIndex({
                        username: -1
                    }, {
                        unique: true,
                        background: true,
                        w: 1
                    }, function(err, indexName) {
                        callback();
                    });
                },
                function(callback) {
                    app.get("database").collection(config.prefix + "_users").ensureIndex({
                        email: 1
                    }, {
                        unique: true,
                        background: true,
                        w: 1
                    }, function(err, indexName) {
                        callback();
                    });
                },
                function(callback) {
                    app.get("database").collection(config.prefix + "_users").ensureIndex({
                        email: -1
                    }, {
                        unique: true,
                        background: true,
                        w: 1
                    }, function(err, indexName) {
                        callback();
                    });
                },
                function(callback) {
                    app.get("database").collection(config.prefix + "_users").ensureIndex({
                        realname: 1
                    }, {
                        unique: false,
                        background: true,
                        w: 1
                    }, function(err, indexName) {
                        callback();
                    });
                },
                function(callback) {
                    app.get("database").collection(config.prefix + "_users").ensureIndex({
                        realname: -1
                    }, {
                        unique: false,
                        background: true,
                        w: 1
                    }, function(err, indexName) {
                        callback();
                    });
                },
                function(callback) {
                    app.get("database").collection(config.prefix + "_users").ensureIndex({
                        status: 1
                    }, {
                        unique: false,
                        background: true,
                        w: 1
                    }, function(err, indexName) {
                        callback();
                    });
                },
                function(callback) {
                    app.get("database").collection(config.prefix + "_users").ensureIndex({
                        status: -1
                    }, {
                        unique: false,
                        background: true,
                        w: 1
                    }, function(err, indexName) {
                        callback();
                    });
                },
                function(callback) {
                    callback();
                    return next();
                }
            ]);
        },
        check_auth = function(req, res, next) {
            if (!req.session || !req.session.auth_id) {
                delete req.session.auth_data;
                return next();
            }
            var config = app.get("config"),
                ObjectId = app.get("database_objectid");

            app.get("database").collection(config.prefix + "_users").findOne({ _id: new ObjectId(req.session.auth_id) }, function(err, user) {
                if (err || !user) delete req.session.auth_id;
                req.session.auth_data = user;
                next();
            });
        };

    /* Return */
    return [ensure_indexes, check_auth];
};
