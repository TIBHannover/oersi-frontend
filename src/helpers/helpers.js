import {i18n} from "next-i18next"
import moment from "moment"
import "moment/locale/de"

/**
 * function to get the location and return a value for  specific query parameters
 * @param {Location} location Get location
 * @param {string} queryToSearch String to check if exist or not in URL example: queryToSearch="pageSize"
 */
export function getParams(router, queryToSearch) {
  const searchParams = new URLSearchParams(router.query)
  if (searchParams.has(queryToSearch) === true)
    return searchParams.get(queryToSearch)
  else return null
}

/**
 *
 * @param {Location} location Get location
 * @param {Object} queryToInsertUpdate Contain key/value for setting or Ubdating Params in URL example {name:'size',value:5}
 */
export function setParams(location, queryToInsertUpdate) {
  const addUpdateParams = new URLSearchParams(location.search)
  addUpdateParams.set(queryToInsertUpdate.name, queryToInsertUpdate.value)
  return addUpdateParams
}

export function getThumbnailUrl(resourceId) {
  const fileId =
    resourceId && resourceId.length > 250 ? resourceId.substring(0, 250) : resourceId
  return process.env.NEXT_PUBLIC_PUBLIC_URL + "/thumbnail/" + fileId + ".webp"
}

export function getDisplayValue(rawValue, fieldOption, translateFnc) {
  if (rawValue === "N/A") {
    return translateFnc("LABEL.N/A")
  } else if (fieldOption?.defaultDisplayType === "licenseGroup") {
    return getLicenseGroupById(rawValue).toUpperCase()
  }
  return processFieldOption(rawValue, fieldOption, translateFnc)
}
export function processFieldOption(value, fieldOption, translateFnc) {
  let result = value
  if (fieldOption?.translationNamespace) {
    const translate = (v) =>
      translateFnc(fieldOption.translationNamespace + "#" + v, {
        keySeparator: false,
        nsSeparator: "#",
      })
    result = Array.isArray(value) ? value.map(translate) : translate(value)
  }
  return result
}

/**
 * Get the group for the given license
 * @param {string} licenseId
 */
export function getLicenseGroupById(licenseId) {
  if (licenseId) {
    if (
      licenseId
        .toLowerCase()
        .startsWith("https://creativecommons.org/publicdomain/mark")
    ) {
      return "PDM"
    } else if (licenseId.match("^https?://www.apache.org/licenses/.*")) {
      return "Apache"
    } else if (
      licenseId.match("^https?://(www.)?opensource.org/licenses?/0?[bB][sS][dD].*")
    ) {
      return "BSD"
    } else if (licenseId.match("^https?://www.gnu.org/licenses/[al]?gpl.*")) {
      return "GPL"
    } else if (licenseId.match("^https?://www.gnu.org/licenses/fdl.*")) {
      return "FDL"
    } else if (
      licenseId.match("^https?://(www.)?opensource.org/licenses?/[mM][iI][tT]")
    ) {
      return "MIT"
    }
    const regex =
      /^https?:\/\/[a-zA-Z0-9.-]+\/(?:licenses|licences|publicdomain)(?:\/publicdomain)?\/([a-zA-Z-]+)/g
    let match = regex.exec(licenseId)
    if (match) {
      return match[1]
    }
  }
  return ""
}
export function getLicenseLabel(license) {
  let regex =
    /^https?:\/\/creativecommons.org\/(?:licenses|licences|publicdomain)(?:\/publicdomain)?\/([a-zA-Z-]+)(?:\/([0-9.]+))?(?:\/([a-z]{2})(?:$|\/))?/g
  let match = regex.exec(license)
  if (match) {
    let label
    const group = match[1].toLowerCase()
    const version = match[2]
    const country = match[3]
    if (group === "mark") {
      label = "Public Domain Mark"
    } else if (group === "zero") {
      label = "CC0"
    } else {
      label = "CC " + group.toUpperCase()
    }
    if (version) {
      label += " " + version
    }
    if (country) {
      label += " " + country.toUpperCase()
    }
    return label
  }
  regex = /^https?:\/\/www.apache.org\/licenses\/LICENSE-([0-9.]+)/g
  match = regex.exec(license)
  if (match) {
    const version = match[1]
    return "Apache " + version
  }
  regex = /^https?:\/\/(?:www.)?opensource.org\/licenses?\/[mM][iI][tT]/g
  match = regex.exec(license)
  if (match) {
    return "MIT"
  }
  regex = /^https?:\/\/(?:www.)?opensource.org\/licenses?\/(0?[bB][sS][dD].*)/g
  match = regex.exec(license)
  if (match) {
    return match[1]
  }
  regex = /^https?:\/\/www.gnu.org\/licenses\/([al]?gpl)(?:-([0-9.]+))?/g
  match = regex.exec(license)
  if (match) {
    let label = "GNU " + match[1].toUpperCase()
    const version = match[2]
    if (version) {
      label += " " + version
    }
    return label
  }

  return ""
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
  var urlBuild = process.env.NEXT_PUBLIC_PUBLIC_URL
  if (str) {
    urlBuild = urlBuild + "/" + str
  }
  return new URL(urlBuild)
}

/**
 * Function that determines the privacy-policy-link from the given links matches the given language-code (or fallback-lng)
 * @param {Array} privacyPolicyLinks All link from Configuration
 * @param {String} lang  Language Code from Translate
 */
export function getPrivacyPolicyLinkForLanguage(
  privacyPolicyLinks,
  lang,
  fallBackLang
) {
  let policyEntry = undefined
  if (privacyPolicyLinks || privacyPolicyLinks instanceof Array) {
    policyEntry = Array.from(privacyPolicyLinks).filter(
      (item) => item["language"] === lang && item["path"]
    )[0]
    if (policyEntry === undefined) {
      policyEntry = Array.from(privacyPolicyLinks).filter(
        (item) => fallBackLang.includes(item["language"]) && item["path"]
      )[0]
    }
  }

  if (policyEntry !== undefined)
    return !isValidURL(policyEntry["path"])
      ? buildUrl(policyEntry["path"])
      : policyEntry["path"]

  return undefined
}

export function formatDate(date, format) {
  if (date !== null) {
    moment.locale(i18n.language)
    return moment(date).format(format)
  } else {
    return ""
  }
}

export function getSafeUrl(url) {
  const whitelistProtocols = ["http", "https"]
  return whitelistProtocols.find((p) => url?.toString().startsWith(p + ":"))
    ? url
    : ""
}

export function getEmbedValues(embeddingConfig, baseFieldValues, record) {
  return {
    ...baseFieldValues,
    mediaUrl: getSafeUrl(getValueFromRecord(embeddingConfig?.mediaUrl, record)),
    fallbackMediaUrl: embeddingConfig?.fallbackMediaUrl
      ?.map((e) =>
        getValuesFromRecord({field: e}, record).map((e) => getSafeUrl(e.field))
      )
      .flat(),
  }
}
export function getBaseFieldValues(baseFieldConfig, record) {
  const getRawValues = (fieldName) =>
    getValuesFromRecord({field: fieldName}, record)
      .filter((e) => e.field)
      .map((e) => e.field)
  const licenseUrl = getSafeUrl(
    getValueFromRecord(baseFieldConfig.licenseUrl, record)
  )
  return {
    title: getValueFromRecord(baseFieldConfig.title, record),
    resourceLink: getSafeUrl(
      getValueFromRecord(baseFieldConfig.resourceLink, record)
    ),
    description: getValueFromRecord(baseFieldConfig.description, record),
    keywords: getRawValues(baseFieldConfig.keywords),
    author: getRawValues(baseFieldConfig.author),
    licenseUrl: licenseUrl,
    licenseGroup: getLicenseGroupById(licenseUrl).toLowerCase(),
    thumbnailUrl: getSafeUrl(
      getValueFromRecord(baseFieldConfig.thumbnailUrl, record)
    ),
  }
}
export function getValueFromRecord(fieldName, record) {
  if (!fieldName || !record) {
    return null
  }
  const values = getValuesFromRecord({field: fieldName}, record)
  return values.length > 0 ? values[0].field : null
}
/**
 *
 * @param fields get values for these fields; format is a map fieldId -> fieldName, example {field: "name", linkField: "url"}
 * @param record the record (or sub-record) to get the values from
 * @returns a list containing all found values, each entry of the form {<fieldId1>: <value1>, <fieldId2>: <value2>}
 */
export function getValuesFromRecord(fields, record) {
  if (!record) {
    return []
  }
  const hasSubfields = (f) => f.includes(".")
  const getCurrentFieldName = (f) => f.substring(0, f.indexOf("."))
  const getNextSubfieldName = (f) => f.substring(f.indexOf(".") + 1)
  const getFieldValue = (fieldName, object) => {
    if (object?.hasOwnProperty(fieldName)) {
      return object[fieldName]
    }
    return ""
  }
  const fieldsByCurrentFieldName = Object.entries(fields)
    .filter(([k, v]) => v)
    .map(([k, v]) => {
      if (hasSubfields(v)) {
        return {cur: getCurrentFieldName(v), next: getNextSubfieldName(v), id: k}
      }
      return {cur: v, next: null, id: k}
    })
    .reduce((groups, item) => {
      const group = groups[item.cur] || []
      group.push(item)
      groups[item.cur] = group
      return groups
    }, {})
  const combine = (a, b) => a.map((e1) => b.map((e2) => ({...e1, ...e2}))).flat()
  let resultList = []
  for (let [curField, items] of Object.entries(fieldsByCurrentFieldName)) {
    const value = getFieldValue(curField, record)
    const values = Array.isArray(value) ? value : [value]
    const curFieldResultList = values
      .map((v) => {
        const result = {}
        items
          .filter((e) => !e.next)
          .forEach((e) => {
            result[e.id] = v
          })
        const nextItems = items
          .filter((e) => e.next)
          .reduce((fields, item) => {
            fields[item.id] = item.next
            return fields
          }, {})
        if (Object.keys(nextItems).length > 0) {
          return combine([result], getValuesFromRecord(nextItems, v))
        }
        return [result]
      })
      .flat()
    resultList =
      resultList.length === 0
        ? curFieldResultList
        : combine(resultList, curFieldResultList)
  }
  return resultList
}
