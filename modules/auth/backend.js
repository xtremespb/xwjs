module.exports = function(app) {
    var backend = function(req, res, callback) {
            callback("OK");
        };
    return backend;
};
