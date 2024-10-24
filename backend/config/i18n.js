const path = require('path');
const i18next = require('i18next');
const middleware = require('i18next-http-middleware');

i18next
.use(middleware.LanguageDetector)
.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
        en: {
            translation: require('./locales/en.json')
        },
        es: {
            translation: require('./locales/es.json')
        }
    }
});

module.exports = {
    i18next,
    middleware: middleware.handle(i18next)
};
