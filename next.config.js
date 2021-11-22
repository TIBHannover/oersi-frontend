const { i18n } = require('./next-i18next.config')

module.exports = (phase, { defaultConfig }) => {
  return {
    i18n: i18n
    // TODO using this configuration or is it sufficient to use ".env"-configs?
    // serverRuntimeConfig: {
    //   // Will only be available on the server side
    // },
    // publicRuntimeConfig: {
    //   // Will be available on both server and client
    //   // elasticSearch: {
    //   //   app: "oer_data",
    //   //   url: "http://192.168.98.115/resources/api-internal/search",
    //   // },
    // }
  }
}