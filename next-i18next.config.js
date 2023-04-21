const I18NextHttpBackend = require("i18next-http-backend")

module.exports = {
  i18n: {
    localeDetection: false,
    defaultNS: "translation",
    ns: ["translation", "language", "labelledConcept"],
    defaultLocale: "en",
    locales: ["da", "de", "en", "es", "fi", "fr", "nl"],
  },
  debug: false,
  ns: ["translation", "language", "labelledConcept"],
  serializeConfig: false,
  use: [I18NextHttpBackend],
  backend: {
    requestOptions: {
      mode: "no-cors",
      cache: "default",
    },
    loadPath: (lng, namespaces) => {
      if (namespaces[0] === "labelledConcept") {
        return `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/label/{{lng}}`
      } else {
        return `${process.env.NEXT_PUBLIC_PUBLIC_URL}/locales/{{lng}}/{{ns}}.json`
      }
    },
    backends: [I18NextHttpBackend],
    backendOptions: [
      {
        loadPath: (lng, namespaces) => {
          if (namespaces[0] === "labelledConcept") {
            return `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/label/{{lng}}`
          } else {
            return `${process.env.NEXT_PUBLIC_PUBLIC_URL}/locales/{{lng}}/{{ns}}.json`
          }
        },
        requestOptions: {
          mode: "no-cors",
          cache: "default",
        },
      },
    ],
  },
  interpolation: {
    escapeValue: false,
  },
}
