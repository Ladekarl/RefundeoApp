'use strict';

import I18n from 'react-native-i18n';
import en from '../../locales/en.json';
import da from '../../locales/da.json';
import moment from 'moment/moment';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

const supportedLocales = ['da', 'en'];
// Define the supported translations
I18n.translations = {
    en,
    da
};

I18n.fallbacks = true;

export function strings(name, params = {}) {
    return I18n.t(name, params);
}

export function formatDate(date) {
    const localeFormatted = getCurrentLocaleFormatted();
    return moment(date).locale(supportedLocales.indexOf(localeFormatted) > -1 ? localeFormatted : 'en').format('LL');
}

export function getCurrentLocaleFormatted() {
    const locale = I18n.currentLocale();
    return locale.indexOf('-') === -1 ? locale : locale.substr(0, locale.indexOf('-'));
}

export default I18n;