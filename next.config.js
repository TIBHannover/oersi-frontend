const {i18n} = require("./next-i18next.config")

module.exports = (phase, {defaultConfig}) => {
  return {
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
    i18n: i18n,
  }
}
