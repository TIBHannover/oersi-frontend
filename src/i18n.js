import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import Backend from "i18next-chained-backend"
import HttpApi from "i18next-http-backend"
import LanguageDetector from "i18next-browser-languagedetector"
import LocalStorageBackend from "i18next-localstorage-backend"

const fallbackLng = ["en", "de"]
const {GENERAL_CONFIGURATION} = window["runTimeConfig"]

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng, // if user computer language is not on the list of available languages, than we will be using the fallback language specified earlier
    debug: true,
    backend: {
      backends: [LocalStorageBackend, HttpApi],
      backendOptions: [
        {
          expirationTime: GENERAL_CONFIGURATION.I18N_CACHE_EXPIRATION,
        },
        {
          // for all available options read the backend's repository readme file
          loadPath: (lng, namespaces) => {
            switch (namespaces[0]) {
              case "lrt":
              case "subject":
                return `${window.location.pathname}api-internal/label/{{lng}}`
              default:
                return `${window.location.pathname}locales/{{lng}}/{{ns}}.json`
            }
          },
        },
      ],
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
