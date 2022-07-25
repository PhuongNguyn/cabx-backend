const i18n = require('i18n')
const appConfig = require('../config/appconfig')

i18n.configure({
    locales:['en', 'vi'],
    directory: __dirname + '/locales',
    defaultLocale: appConfig.app.lang
});

module.exports = i18n