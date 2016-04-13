var website = {
	/*

	Main configuration:

	define your logo URL, e-mail addresses etc.

	*/
    logo_url: "http://127.0.0.1:3000/xwjs/images/xwjs_logo.png",
    email: {
        noreply: "noreply@localhost",
        contact: "info@localhost",
    },
    /*

	Locales:

	locale-sensitive configuration (languages available, site title etc.)
	Note: first item in locales.avail is the default language

	*/
    locales: {
        avail: ["en", "ru"],
        source: {
            query: true,
            cookie: true,
            subdomain: true,
            session: true
        },
        dev_mode: true
    },
    en: {
        lang: "English",
        url: "http://127.0.0.1:3000",
        title: "Default XWJS website"
    },
    ru: {
        lang: "Русский",
        url: "http://127.0.0.1:3000",
        title: "Сайт на движке XWJS"
    }
};

module.exports = website;
