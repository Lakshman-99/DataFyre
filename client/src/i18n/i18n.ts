import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { store } from '../redux/store.ts';

// Import your JSON translation files
import enTranslation from "./en/i18n_en.json";
import taTranslation from "./ta/i18n_ta.json";

i18n.use(initReactI18next) // Pass i18n instance to react-i18next
    .init({
        resources: {
            en: {
                translation: enTranslation, // English translation
            },
            ta: {
                translation: taTranslation, // Tamil translation
            },
        },
        lng: "en", // Default language
        fallbackLng: "en", // Fallback language if translation is not available in the selected language
        interpolation: {
            escapeValue: false, // React already escapes by default
        },
    });

// Listen for Redux language changes and update i18n language
store.subscribe(() => {
    const language = store.getState().language.language;
    if (i18n.language !== language) {
        i18n.changeLanguage(language);
    }
});

export default i18n;
