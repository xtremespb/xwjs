module.exports = function(app) {
    var path = require("path"),
        users = require(path.join(__dirname, 'schema', 'users'));

    var check_auth = function(req, res, next) {
        if (!req.session || !req.session.auth_id) return next();
        users.findOne({ where: { id: req.session.auth_id, status: { gt: 0 } } }, function(err, user) {
            if (err || !user) delete req.session.auth_id;
            app.set("auth", user);
            next();
        });
    };

    /* Return */
    return [check_auth];
};
