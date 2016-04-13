var nunjucks = require("nunjucks"),
    path = require("path");
nunjucks.configure(path.join(__dirname, "..", "views"), {
    autoescape: true,
    watch: true
});
module.exports = nunjucks;
