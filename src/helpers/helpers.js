import i18next from "i18next"

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
 * Retrieve the (translated) label for the given component.
 */
export function getLabelForStandardComponent(label, component, translateFnc) {
  if (label === "N/A") {
    return translateFnc("LABEL.N/A")
  } else if (component === "language") {
    return translateFnc("language:" + label)
  } else if (component === "license") {
    return getLicenseGroup(label).toUpperCase()
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

/**
 * Get the group for the given license
 * @param {string} license
 */
export function getLicenseGroup(license) {
  if (license) {
    if (
      license
        .toLowerCase()
        .startsWith("https://creativecommons.org/publicdomain/mark")
    ) {
      return "PDM"
    }
    const regex = /^https?:\/\/[a-zA-z0-9.-]+\/(?:licenses|licences|publicdomain)(?:\/publicdomain)?\/([a-zA-Z-]+)/g
    let match = regex.exec(license)
    if (match) {
      return match[1]
    }
  }
  return ""
}

/**
 *
 * @param {*} callBackFunction a call back function where we can implement our logic
 */
export async function getRequestWithLanguage(callBackFunction) {
  let language = i18next.language
  if (
    i18next.language === null ||
    i18next.language === "" ||
    i18next.language === undefined
  ) {
    language = i18next.languages[0]
  }
  const response = await callBackFunction(language)
  if (!response) {
    for (let fallbackLanguage of i18next.languages.filter(
      (item) => item !== i18next.language
    )) {
      const statusOK = await callBackFunction(fallbackLanguage)
      if (statusOK) break
    }
  }
}

/**
 * function that check if a string is valid Url or not
 * @param {string} str an Url as string to check if is valid or not
 * @returns {boolean} value, true if is valid
 */
export function isValidURL(str) {
  var pattern = new RegExp("(www.|http://|https://|ftp://)")
  return pattern.test(str)
}

/**
 * function that build a url with a path
 * @param {string} str an path to attach in Url
 * @returns {string} return complete url
 */
export function buildUrl(str) {
  var urlBuild =
    window.location.protocol + "//" + window.location.host + window.location.pathname
  if (str) {
    urlBuild = urlBuild + str
  }
  return new URL(urlBuild)
}
