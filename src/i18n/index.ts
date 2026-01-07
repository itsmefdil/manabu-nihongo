import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import id from './locales/id.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            id: { translation: id },
        },
        lng: 'id', // Default to Indonesian
        fallbackLng: 'id',
        interpolation: {
            escapeValue: false, // React already escapes
        },
    });

export default i18n;
