var fs = require("fs-extra"),
    path = require("path"),
    compressor = require(path.join(__dirname, "..", "core", "minify"));

try {
    var minify_file = path.join(__dirname, "..", "etc", "minify.json");
    fs.accessSync(minify_file, fs.F_OK);
    var minify = fs.readJsonSync(minify_file, { throws: true });
    if (minify.js) {
        for (var f in minify.js) {
            fs.ensureDirSync(path.join(__dirname, "..", "static", "xwjs", "js"));
            new compressor.minify({
                type: "uglifyjs",
                publicFolder: path.join(__dirname, "..", "views", "js", "/"),
                fileIn: minify.js[f].source,
                fileOut: path.join(__dirname, "..", "static", "xwjs", "js", minify.js[f].output),
                sync: true
            });
        }
    }
    if (minify.css) {
        for (var f in minify.css) {
            fs.ensureDirSync(path.join(__dirname, "..", "static", "xwjs", "css"));
            new compressor.minify({
                type: "sqwish",
                publicFolder: path.join(__dirname, "..", "views", "css", "/"),
                fileIn: minify.css[f].source,
                fileOut: path.join(__dirname, "..", "static", "xwjs", "css", minify.css[f].output),
                sync: true
            });
        }
    }
} catch (e) {
    console.log(e);
    // It"s OK, do nothing in this case
}

/* Compress modules */
var modules = fs.readdirSync(path.join(__dirname, "..", "modules"));
for (var m in modules)
    if (fs.lstatSync(path.join(__dirname, "..", "modules", modules[m])).isDirectory()) {
        try {
            var minify_file = path.join(__dirname, "..", "modules", modules[m], "minify.json");
            fs.accessSync(minify_file, fs.F_OK);
            var minify = fs.readJsonSync(minify_file, { throws: true });
            if (minify.js) {
                for (var f in minify.js) {
                    fs.ensureDirSync(path.join(__dirname, "..", "modules", modules[m], "static", "modules", modules[m], "js"));
                    new compressor.minify({
                        type: "uglifyjs",
                        publicFolder: path.join(__dirname, "..", "modules", modules[m], "views", "js", "/"),
                        fileIn: minify.js[f].source,
                        fileOut: path.join(__dirname, "..", "modules", modules[m], "static", "modules", modules[m], "js", minify.js[f].output),
                        sync: true
                    });
                }
            }
            if (minify.css) {
                for (var f in minify.css) {
                    fs.ensureDirSync(path.join(__dirname, "..", "modules", modules[m], "static", "modules", modules[m], "css"));
                    new compressor.minify({
                        type: "sqwish",
                        publicFolder: path.join(__dirname, "..", "modules", modules[m], "views", "css", "/"),
                        fileIn: minify.css[f].source,
                        fileOut: path.join(__dirname, "..", "modules", modules[m], "static", "modules", modules[m], "css", minify.css[f].output),
                        sync: true
                    });
                }
            }
        } catch (e) {
            console.log(e);
            // It"s OK, do nothing in this case
        }
    }

