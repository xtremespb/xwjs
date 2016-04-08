module.exports = function(app) {
    var logger = require('./logger'),
    	default_routes = {
        first: function(req, res, next) {
            logger.debug(req.ip + " " + req.method + " " + req.originalUrl);
            if (!req.session) {
                var err = new Error("Internal server error (session engine not connected)");
                err.status = 500;
                return next(err);
            }
            next();
        },
        notFound: function(req, res, next) {
            var err = new Error("Not found");
            err.status = 404;
            next(err);
        },
        errorHandler: function(err, req, res, next) {
        	res.status(err.status || 500);
        	logger.error(req.ip + " " + req.method + " " + req.originalUrl + " [" + err.status + "] " + err.message);
        	res.send(err.status + " " + err.message);
        }
    };
    return default_routes;
};
