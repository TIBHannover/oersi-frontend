const I18NextHttpBackend = require("i18next-http-backend")

module.exports = {
  i18n: {
    localeDetection: false,
    defaultNS: "translation",
    ns: ["translation", "language", "audience", "lrt", "subject"],
    defaultLocale: "en",
    locales: ["da", "de", "en", "es", "fi", "fr", "nl"],
  },
  debug: false,
  ns: ["translation", "language", "audience", "lrt", "subject"],
  serializeConfig: false,
  use: [I18NextHttpBackend],
  backend: {
    requestOptions: {
      mode: "no-cors",
      cache: "default",
    },
    loadPath: (lng, namespaces) => {
      switch (namespaces[0]) {
        case "audience":
        case "lrt":
        case "subject":
          return `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/label/{{lng}}?vocab={{ns}}`
        default:
          return `${process.env.NEXT_PUBLIC_PUBLIC_URL}/locales/{{lng}}/{{ns}}.json`
      }
    },
    backends: [I18NextHttpBackend],
    backendOptions: [
      {
        loadPath: (lng, namespaces) => {
          switch (namespaces[0]) {
            case "audience":
            case "lrt":
            case "subject":
              return `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/label/{{lng}}?vocab={{ns}}`
            default:
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
