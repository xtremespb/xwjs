#!/usr/bin/env node

/**********************************************************

  This is the xw.js startup file
  Modify it accoding to your needs

***********************************************************/

/* Defining variables and loading configuration */

var path = require('path'),
	config = require(path.join('..', 'etc', 'config')),
    port = process.env.PORT || config.server.port || '3000',
    host = process.env.HOST || config.server.host || '127.0.0.1',
    app = require(path.join('..', 'core', 'app')),
    http = require('http');

app.set('host', host).set('port', port);
var server_error_handlers = require(path.join('..', 'core', 'server_error_handlers'))(app);

/* Staring the server */

http.createServer(app).on('listening', server_error_handlers.onListening).on('error', server_error_handlers.onError).listen(port, host);
