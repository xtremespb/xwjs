module.exports = function(app) {
    var path = require("path"),
        logger = require("./logger"),
        config = require(path.join(__dirname, "..", "etc", "config")),
        connecting = false;

    var database = {
        init: function(callback) {
            if (!app.get("database") && !connecting) {
            	connecting = true;
                if (config.database.file) {
                    /* TingoDB */
                    var tingodb = require('tingodb')().Db,
                        db = new tingodb(config.database.file, config.database.options);
                    app.set("database_objectid", require('tingodb')().ObjectID);
                    if (db) {
                        app.set("database", db);
                        connecting = false;
                        return callback(true);
                    } else {
                        app.set("database", undefined);
                        logger.error("TingoDB connection failed");
                        connecting = false;
                        return callback(false);
                    }
                } else {
                    /* MongoDB */
                    var mongodb = require("mongodb").MongoClient;
                    app.set("database_objectid", require('mongodb').ObjectID);
                    mongodb.connect(config.database.url, config.database.options, function(err, db) {
                        if (!err) {
                            app.set("database", db);
                            db.on("close", function() {
                                app.set("database", undefined);
                            });
                            connecting = false;
                            return callback(true);
                        } else {
                            app.set("database", undefined);
                            logger.error("[DATABASE] " + err);
                            connecting = false;
                            return callback(false);
                        }
                    });
                }
            } else {
            	return callback(true);
            }
        }
    };

    return database;

};
