module.exports = function(app) {
    var nodemailer = require("nodemailer"),
        path = require("path"),
        config = require(path.join("..", "etc", "config")),
        config_website = require(path.join("..", "etc", "website")),
        striptags = require('striptags'),
        logger = require(path.join(__dirname, "logger")),
        transporter = config.transporter,
        te = require(path.join(__dirname, "template_engine"))(app),
        async = require("async");

    te.init(path.join(__dirname, "..", "views"));

    var mailer = {
        send: function(to, subj, message, i18n, noreply, callback) {
            var html_template = message;
            async.series([
                function(cb) {
                    te.get().render("mail.njk", {
                        config: config,
                        config_website: config_website,
                        lang: i18n.get().getLocale(),
                        to: to,
                        subj: subj,
                        msg: message
                    }, function(err, html) {
                        if (!err) html_template = html;
                        cb();
                    });
                },
                function(cb) {
                    var mail_options = {
                    	config: config,
                    	config_website: config_website,
                        from: config_website.email.contact,
                        to: to,
                        subject: subj,
                        text: message,
                        html: html_template
                    };
                    if (noreply) mail_options.from = config_website.email.noreply;
                    transporter.sendMail(mail_options, function(error, info) {
                        if (!error) {
                            logger.debug("[MAILER] mail sent to " + info.envelope.to + ", message ID: " + info.messageId);
                        } else {
                            logger.error("[MAILER] " + error);
                        }
                        callback(error);
                        return cb();
                    });
                }
            ]);
        }
    };
    return mailer;
};
