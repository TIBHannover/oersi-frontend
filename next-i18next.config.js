const HttpBackend = require("i18next-http-backend/cjs")
const ChainedBackend = require("i18next-chained-backend").default
const LocalStorageBackend = require("i18next-localstorage-backend").default

const isBrowser = typeof window !== "undefined"
const labelApiUrl =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL +
  process.env.NEXT_PUBLIC_BACKEND_API_PATH_LABEL

module.exports = {
  i18n: {
    localeDetection: true,
    defaultLocale: "en",
    locales: ["da", "de", "en", "es", "fi", "fr", "nl"],
  },
  debug: false,
  defaultNS: "translation",
  ns: ["translation", "language", "labelledConcept"],
  serializeConfig: false,
  use: isBrowser ? [ChainedBackend] : [],
  backend: {
    backends: [LocalStorageBackend, HttpBackend],
    backendOptions: [
      {expirationTime: 60 * 60 * 1000},
      {
        loadPath: (lng, namespaces) => {
          if (namespaces[0] === "labelledConcept") {
            return `${labelApiUrl}/{{lng}}`
          } else {
            return `${process.env.NEXT_PUBLIC_PUBLIC_URL}/locales/{{lng}}/{{ns}}.json`
          }
        },
      },
    ],
  },
  interpolation: {
    escapeValue: false,
  },
}
