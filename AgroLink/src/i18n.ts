import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { gu } from "./locales/gu";
import { en } from "./locales/en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      gu: { translation: gu },
      en: { translation: en }
    },
    lng: "gu", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // React already escapes by default
    }
  });

export default i18n;