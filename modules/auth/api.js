module.exports = function(app) {
    var path = require("path"),
        users = require(path.join(__dirname, 'schema', 'users')),
        mailer = require(path.join(__dirname, "..", "..", "core", "mailer"))(app),
        i18n = require(path.join(__dirname, "..", "..", "core", "i18n"))(app);

    i18n.init("auth");

    var lang = function(req, res, next) {
            res.setHeader('Content-Type', 'application/javascript');
            i18n.detect_locale(req);
            res.send("var i18n = " + JSON.stringify(i18n.get().locales[i18n.get().getLocale()]) + ";");
        },
        login = function(req, res, next) {
            res.setHeader('Content-Type', 'application/json');
            var username = req.query.username,
                password = req.query.password,
                err_code = 0;
            // Username and password validation
            if (!username || typeof username !== "string" || !username.match(/^[A-Za-z0-9_\-]{3,20}$/)) err_code = 10;
            if (!password || typeof password !== "string" || !password.match(/^.{8,64}$/)) err_code = 20;
            // Return if error code is not equal to zero
            if (err_code !== 0) return res.send(JSON.stringify({ err_code: err_code }));
            username = username.trim();
            password = password.trim();
            // Check the database
            users.findOne({ where: { username: username, password: password } }, function(err, user) {
                if (err || !user) err_code = 3;
                return res.send(JSON.stringify({ err_code: err_code }));
            });
        },
        register = function(req, res, next) {
            res.setHeader('Content-Type', 'application/json');
            i18n.detect_locale(req);
            mailer.send("xtreme@rh1.ru", "Just a test", "<b>Hello</b> медвед", i18n, true, function(err) {
            });
            var username = req.query.username,
                email = req.query.email,
                password = req.query.password,
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
            // Check the database
            users.findOrCreate({ username: username }, { email: email, password: password }, function(err, user) {
                if (err || !user) err_code = 3;
                req.session.user_id = user.id;
                return res.send(JSON.stringify({ err_code: err_code, user_id: user.id }));
            });
        };

    /* Return routes and methods */

    var router = app.get("express").Router();
    router.get("/lang", lang);
    router.get("/login", login);
    router.get("/register", register);

    return {
        router: router,
        methods: {
        }
    };
};
