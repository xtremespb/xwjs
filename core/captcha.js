var path = require("path"),
	config = require(path.join("..", "etc", "config")),
	captcha = require(path.join(__dirname, "captcha", config.captcha.driver));

module.exports = captcha;