module.exports = function(app) {
	var router = app.get('express').Router(),
		path = require("path"),
		config = app.get("config"),
		config_website = app.get("config_website"),
		i18n = require(path.join(__dirname, "..", "..", "core", "i18n"))(app);
	i18n.init("auth");
	router.get("/", function(req, res) {
		i18n.detect_locale(req);
		return res.send(i18n.get().getLocale());
	});
	return router;
};