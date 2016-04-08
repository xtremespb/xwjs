var caminte = require('caminte'),
	path = require('path'),
	config = require(path.join('..', 'etc', 'config')),
    schema = caminte.Schema,
    schema = new Schema(config.orm.driver, config.orm.config);

module.exports = schema;
