import i18next from "i18next";
import Backend from "i18next-fs-backend";

i18next
  .use(Backend)
  .init({
    lng: "es", // Idioma por defecto
    fallbackLng: "en", // Idioma de respaldo
    backend: {
      loadPath: "./locales/{{lng}}/translation.json",
    },
    interpolation: {
      escapeValue: false, // No escapar valores por defecto
    },
  })
  .then(() => console.log("i18next initialized"))
  .catch((err) => console.error("Error loading i18next:", err));

export default i18next;
