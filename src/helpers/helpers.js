import Iso639Type from "iso-639-language"
import i18next from "i18next"

const iso639_1 = Iso639Type.getType(1)

/**
 * function to get the location and return a value for  specific query parameters
 * @param {windows.location} location Get location
 * @param {string} queryToSearch String to check if exist or not in URL example: queryToSearch="pageSize"
 */
export default function getParams(location, queryToSearch) {
  const searchParams = new URLSearchParams(location.search)
  if (searchParams.has(queryToSearch) === true)
    return searchParams.get(queryToSearch)
  else return null
}

/**
 *
 * @param {windows.location} location Get location
 * @param {Object} queryToInsertUpdate Contain key/value for setting or Ubdating Params in URL example {name:'size',value:5}
 */
export function setParams(location, queryToInsertUpdate) {
  const addUpdateParams = new URLSearchParams(location.search)
  addUpdateParams.set(queryToInsertUpdate.name, queryToInsertUpdate.value)
  return addUpdateParams
}

/**
 * Retrieve the (translated) label for the language identified by the given language code.
 * @param {string} languageCode iso639-1 code of the language to retrieve the label for
 * @param {string} translationLanguageCode iso639-1 code of the language in which the label should be translated
 * @param {string} fallbackTranslations iso639-1 codes of the languages in which the label should be translated when the translationLanguageCode provides no translation
 */
export function getLabelForLanguage(
  languageCode,
  translationLanguageCode,
  fallbackTranslations
) {
  if (languageCode === null) {
    return languageCode
  }
  let label = iso639_1.getNameByCodeTranslate(languageCode, translationLanguageCode)
  if (!label) {
    for (const fallbackLng of fallbackTranslations) {
      if (fallbackLng !== translationLanguageCode) {
        label = iso639_1.getNameByCodeTranslate(languageCode, fallbackLng)
        if (label) {
          return label
        }
      }
    }
  }
  return label === "" ? languageCode : label
}

/**
 * Retrieve the (translated) label for the given component.
 */
export function getLabelForStandardComponent(label, component, translateFnc) {
  if (component === "language") {
    return getLabelForLanguage(label, i18next.language, i18next.languages)
  } else if (component === "license") {
    return label.split("/").slice(-2)[0].toUpperCase()
  } else if (component === "provider") {
    return translateFnc("provider:" + label, {keySeparator: false})
  } else if (component === "learningResourceType") {
    return translateFnc("lrt#" + label, {keySeparator: false, nsSeparator: "#"})
  } else if (component === "about") {
    return translateFnc("subject#" + label, {keySeparator: false, nsSeparator: "#"})
  } else {
    return label
  }
}
