var caminte = require('caminte'),
	path = require('path'),
	config = require(path.join('..', 'etc', 'config')),
    Schema = caminte.Schema;

// That's a workaround for buggy redis adapter of caminte
// Can be removed when the corresponding issue is fixed
if (config.orm.driver == 'redis') config.orm.driver = path.join(__dirname, 'orm', 'redis_xwjs').replace(/\\/g, '/').replace(/^.\:/,'');
var schema = new Schema(config.orm.driver, config.orm.config);
module.exports = schema;
