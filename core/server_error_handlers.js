module.exports = function(app) {
    var host = app.get('host'),
        logger = require('./logger'),
        port = app.get('port');
    return {
        onError: function(error) {
            if (error.syscall !== 'listen') throw error;
            var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
            switch (error.code) {
                case 'EACCES':
                    logger.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    logger.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        },
        onListening: function() {
            logger.info('Listening on ' + host + ':' + port);
        }
    };
};
