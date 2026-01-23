import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// English Locales
import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enDashboard from "./locales/en/dashboard.json";
import enProducts from "./locales/en/products.json";
import enErrors from "./locales/en/errors.json";
import enNews from "./locales/en/news.json";

// Gujarati Locales
import guCommon from "./locales/gu/common.json";
import guAuth from "./locales/gu/auth.json";
import guDashboard from "./locales/gu/dashboard.json";
import guProducts from "./locales/gu/products.json";
import guErrors from "./locales/gu/errors.json";
import guNews from "./locales/gu/news.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        auth: enAuth,
        dashboard: enDashboard,
        products: enProducts,
        errors: enErrors,
        news: enNews
      },
      gu: {
        common: guCommon,
        auth: guAuth,
        dashboard: guDashboard,
        products: guProducts,
        errors: guErrors,
        news: guNews
      }
    },
    fallbackLng: "en",
    defaultNS: "common",
    ns: ["common", "auth", "dashboard", "products", "errors", "news"],
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"]
    }
  });

export default i18n;