module.exports = function(app) {
    var path = require("path"),
    	router = app.get('express').Router(),
        users = require(path.join(__dirname, 'schema', 'users'));
    router.get("/login", function(req, res, next) {
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
    });
    router.get("/register", function(req, res, next) {
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
    });
    return router;
};
