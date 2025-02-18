import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import uz from "./locales/uz";
import ru from "./locales/ru";

i18n.use(initReactI18next).init({
  resources: {
    uz,
    ru,
  },
  lng: "uz",
  fallbackLng: "uz",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
