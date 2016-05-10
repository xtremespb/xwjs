module.exports = function(app) {
    var path = require("path"),
        mailer = require(path.join(__dirname, "..", "..", "core", "mailer"))(app),
        i18n = require(path.join(__dirname, "..", "..", "core", "i18n"))(app),
        async = require("async");

    i18n.init("auth");

    var columns = {
            "_id": 1,
            "username": 1,
            "realname": 1,
            "email": 1,
            "status": 1
        },
        default_items_per_page = 50;

    var lang = function(req, res, next) {
            res.setHeader('Content-Type', 'application/javascript');
            i18n.detect_locale(req);
            res.send("var i18n = " + JSON.stringify(i18n.get().locales[i18n.get().getLocale()]) + ";");
        },
        login = function(req, res, next) {
            res.setHeader('Content-Type', 'application/json');
            var config = app.get("config");
            var username = req.query.username || req.body.username,
                password = req.query.password || req.body.password,
                captcha = req.body.captcha || req.body.captcha,
                err_code = 0;
            // Username and password validation
            if (!username || typeof username !== "string" || !username.trim().match(/^[A-Za-z0-9_\-]{3,20}$/)) err_code = 10;
            if (!password || typeof password !== "string" || !password.trim().match(/^.{8,64}$/)) err_code = 20;
            if (!captcha || typeof captcha !== "string" || !captcha.trim().match(/^[A-Za-z]{5}$/)) err_code = 30;
            if (err_code === 0 && req.session.captcha != captcha.trim().toLowerCase()) err_code = 40;
            req.session.captcha = undefined;
            // Return if error code is not equal to zero
            if (err_code !== 0) return res.send(JSON.stringify({ err_code: err_code }));
            username = username.trim().toLowerCase();
            password = password.trim();
            // Check the database
            app.get("database").collection(config.prefix + "_users").findOne({
                username: username,
                password: password,
                status: { $gt: 0 }
            }, {
                fields: {
                    _id: 1
                }
            }, function(err, user) {
                if (err || !user) {
                    err_code = 100;
                } else {
                    req.session.auth_id = user._id;
                }
                return res.send(JSON.stringify({ err_code: err_code }));
            });
        },
        logout = function(req, res, next) {
            res.setHeader('Content-Type', 'application/json');
            if (req.session && req.session.auth_id) {
                delete req.session.auth_id;
                return res.send(JSON.stringify({ err_code: 0 }));
            } else {
                return res.send(JSON.stringify({ err_code: 10 }));
            }
        },
        register = function(req, res, next) {
            res.setHeader('Content-Type', 'application/json');
            i18n.detect_locale(req);
            var config = app.get("config");
            var username = req.query.username || req.body.username,
                email = req.query.email || req.body.email,
                password = req.query.password || req.body.password,
                err_code = 0;
            // Username and password validation
            if (!username || typeof username !== "string" || !username.trim().match(/^[A-Za-z0-9_\-]{3,20}$/)) err_code = 10;
            if (!password || typeof password !== "string" || !password.trim().match(/^.{8,64}$/)) err_code = 20;
            if (!email || typeof email !== "string" || !email.trim().match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/ || email.length > 80)) err_code = 30;
            // Return if error code is not equal to zero
            if (err_code !== 0) return res.send(JSON.stringify({ err_code: err_code }));
            username = username.trim().toLowerCase();
            password = password.trim();
            email = email.trim().toLowerCase();
            // Insert into the database
            app.get("database").collection(config.prefix + "_users").update({
                username: username,
                email: email
            }, {
                username: username,
                email: email,
                password: password,
                status: 2
            }, {
                new: true,
                upsert: true
            }, function(err, user) {
                if (err || !user) {
                    err_code = 3;
                    return res.send(JSON.stringify({ err_code: err_code }));
                } else {
                    req.session.user_id = user.id;
                    return res.send(JSON.stringify({ err_code: err_code, user_id: user.id }));
                }
            });
        },
        users_list = function(req, res, next) {
            res.setHeader('Content-Type', 'application/json');
            if (!req.session || !req.session.auth_id || req.session.auth_id < 2) return res.send(JSON.stringify({ err_code: 10 }));
            var config = app.get("config");
            var page = req.query.page || req.body.page,
                items_per_page = req.query.page || req.body.items_per_page,
                sort_column = req.query.sort_column || req.body.sort_column,
                sort_direction = req.query.sort_direction || req.body.sort_direction,
                find_string = req.query.find_string || req.body.find_string;
            // Checks
            if (!page || typeof page !== "string" || !page.match(/^[0-9]+$/) || page > 999999) page = 1;
            if (!items_per_page || typeof items_per_page !== "string" || !items_per_page.match(/^[0-9]+$/) || items_per_page > 500) items_per_page = default_items_per_page;
            if (!sort_column || typeof sort_column !== "string" || !sort_column.match(/^[a-zA-Z0-9_\-]+$/) || !columns[sort_column]) sort_column = undefined;
            if (!sort_direction || typeof sort_direction !== "string" || sort_direction != "-1") sort_direction = "1";
            if (!find_string || typeof find_string !== "string" || !find_string.match(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w\s\w_\-\@\*\.]+$/) || find_string.length > 50) {
                find_string = undefined;
            } else {
                find_string = find_string.trim();
            }
            var skip = (page - 1) * items_per_page;
            sort = {};
            if (sort_column) sort[sort_column] = sort_direction;
            var options = {
                    fields: columns,
                    skip: skip,
                    limit: parseInt(items_per_page)
                },
                count = 0;
            async.series([
                function(callback) {
                    app.get("database").collection(config.prefix + "_users").find({}, options).count(function(err, cnt) {
                        if (err) return res.send(JSON.stringify({ err_code: 110 }));
                        count = cnt;
                        callback();
                    });
                },
                function(callback) {
                    app.get("database").collection(config.prefix + "_users").find({}, options).sort(sort).toArray(function(err, users) {
                        if (err) return res.send(JSON.stringify({ err_code: 100 }));
                        callback();
                        return res.send(JSON.stringify({ err_code: 0, count: count, users: users }));
                    });
                }
            ]);

        };

    /* Return routes and methods */

    var router = app.get("express").Router();
    router.get("/lang", lang);
    router.post("/login", login);
    router.post("/logout", logout);
    router.get("/register", register);
    router.post("/users/list", users_list);

    return {
        router: router,
        methods: {}
    };
};
