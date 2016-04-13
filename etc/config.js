/* Required modules */

var intel = require("intel"),
    path = require("path");

/* Configuration */

var prefix = "xwjs",
    /* Configuration for different adapters and services */
    redis = {
        host: "localhost",
        port: 6379,
        prefix: prefix + "_db"
    },
    filestore = {
        path: path.join(__dirname, "..", "tmp", "session")
    },
    tingodb = {
        database: path.join(__dirname, "db")
    },
    /* Configuration variables */
    config = {
    	prefix: prefix,
        server: {
            host: "127.0.0.1",
            port: "3000"
        },
        session: {
        	ttl: 604800, // 7 days
        	store: {
        		name: 'filestore',
        		settings: filestore
        	},
            settings: {
                secret: "pB3fK88kFN952UVMhwa5DWt32b9Qr6FC",
                name: prefix + "_sid",
                rolling: false,
                unset: "destroy",
                resave: true,
                saveUninitialized: true
            }
        },
        logging: {
            level: intel.INFO,
            console: true,
            options: {
                console: {
                    formatter: new intel.Formatter({
                        colorize: true,
                        format: "%(levelname)s %(date)s %(message)s"
                    })
                },
                file: {
                    file: path.join(__dirname, "..", "logs", "xwjs.log"),
                    formatter: new intel.Formatter({
                        colorize: false,
                        format: "%(levelname)s %(date)s %(message)s"
                    })
                }
            }
        },
        orm: {
            driver: "tingodb",
            config: tingodb
        },
        captcha: {
            driver: "yac"
        }
    };

module.exports = config;
