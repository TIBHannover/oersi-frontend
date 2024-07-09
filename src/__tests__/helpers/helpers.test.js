import React from "react"
import i18n from "i18next"
import i18next from "i18next"
import {initReactI18next} from "react-i18next"
import {
  getParams,
  getDisplayValue,
  getRequestWithLanguage,
  setParams,
  isValidURL,
  buildUrl,
  getLicenseLabel,
  getValuesFromRecord,
  processFieldOption,
} from "../../helpers/helpers"

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: ["fr", "es", "it", "en", "de"],
  resources: {
    en: {
      language: {
        de: "German",
        en: "English",
      },
    },
    de: {
      language: {
        de: "Deutsch",
        en: "Englisch",
      },
    },
  },
})

const fieldOptions = {
  about: {
    dataField: "about.id",
    translationNamespace: "labelledConcept",
  },
  language: {
    dataField: "inLanguage",
    translationNamespace: "language",
  },
  learningResourceType: {
    dataField: "learningResourceType.id",
    translationNamespace: "labelledConcept",
  },
  license: {
    dataField: "license.id",
    defaultDisplayType: "licenseGroup",
  },
}

function translateDummy(key, options) {
  return key + "_translated"
}

describe("helpers", () => {
  it("getParams : URL has an param", () => {
    let param = getParams(new URL("http://localhost:3000/?size=10"), "size")
    expect(param).toEqual("10")
  })
  it("getParams : URL has not an param", () => {
    let param = getParams(new URL("http://localhost:3000/"), "size")
    expect(param).toEqual(null)
  })

  it("setParams : We must add an new param into URL", () => {
    let param = setParams(new URL("http://localhost:3000/"), {
      name: "language",
      value: "de",
    })
    expect(param.get("language")).toEqual("de")
  })

  it("getLabelForStandardComponent : label N/A", () => {
    let label = getDisplayValue("N/A", fieldOptions.language, translateDummy)
    expect(label).toEqual("LABEL.N/A_translated")
  })
  it("getLabelForStandardComponent : component language", () => {
    let label = getDisplayValue("de", fieldOptions.language, translateDummy)
    expect(label).toEqual("language#de_translated")
  })
  it("getLabelForStandardComponent : component license", () => {
    let label = getDisplayValue(
      "https://creativecommons.org/publicdomain/zero/1.0",
      fieldOptions.license,
      translateDummy
    )
    expect(label).toEqual("ZERO")
  })
  it("getLabelForStandardComponent : component with translations", () => {
    let label = getDisplayValue(
      "TEST",
      fieldOptions.learningResourceType,
      translateDummy
    )
    expect(label).toEqual("labelledConcept#TEST_translated")
    label = getDisplayValue("TEST", fieldOptions.about, translateDummy)
    expect(label).toEqual("labelledConcept#TEST_translated")
  })
  it("getLabelForStandardComponent : component other", () => {
    let label = getDisplayValue("TESTLABEL", {}, translateDummy)
    expect(label).toEqual("TESTLABEL")
  })
  it("getRequestWithLanguage : Default language is ' ', repeat until it find language 'en'  ", () => {
    i18next.changeLanguage(null)
    getRequestWithLanguage(getCallBackForTest("en"))
    i18next.changeLanguage("en") // back to english again
  })

  it("getRequestWithLanguage : Default language is 'en', http status 200  ", () => {
    i18next.changeLanguage("de")
    getRequestWithLanguage(getCallBackForTest("de"))
    i18next.changeLanguage("en") // back to english again
  })

  it("getRequestWithLanguage : Default Language is 'al',  http status 404, repeat until it find language 'en' ", () => {
    i18next.changeLanguage("al")
    getRequestWithLanguage(getCallBackForTest("en"))
    i18next.changeLanguage("en") // back to english again
  })

  const getCallBackForTest = (expectedLanguage) => {
    return async function callBackForTest(lang) {
      const result = lang
      if (result === expectedLanguage) {
        expect(result).toEqual(expectedLanguage)
        return true
      }
      return false
    }
  }

  it("validURL : Check if a string is valid, Should be valid for 'http://localhost:3000/?size=10&lng=de' ", () => {
    const isValid = isValidURL("http://localhost:3000/?size=10&lng=de")
    expect(isValid).toEqual(true)
  })

  it("validURL : Check if a string is valid, Should not be valid for 'public/privacy/en/policy.html' ", () => {
    const isValid = isValidURL("public/privacy/en/policy.html")
    expect(isValid).toEqual(false)
  })

  it("buildUrl : Should return a url with this path 'privacy/en/policy.html' ", () => {
    const urlBuild = buildUrl("privacy/en/policy.html")
    expect(urlBuild.toString()).toEqual("http://localhost/privacy/en/policy.html")
  })
  it("buildUrl : Should return only url ", () => {
    const urlBuild = buildUrl("")
    expect(urlBuild.toString()).toEqual("http://localhost/")
  })

  it("getLicenseLabel: PDM", () => {
    let result = getLicenseLabel(
      "https://creativecommons.org/publicdomain/mark/1.0/"
    )
    expect(result).toEqual("Public Domain Mark 1.0")
  })
  it("getLicenseLabel: CC0", () => {
    let result = getLicenseLabel(
      "https://creativecommons.org/publicdomain/zero/1.0/"
    )
    expect(result).toEqual("CC0 1.0")
  })
  it("getLicenseLabel: CC BY-SA 3.0 DE", () => {
    let result = getLicenseLabel(
      "https://creativecommons.org/licenses/by-sa/3.0/de/"
    )
    expect(result).toEqual("CC BY-SA 3.0 DE")
  })
  it("getLicenseLabel: CC BY 4.0", () => {
    let result = getLicenseLabel("https://creativecommons.org/licenses/by/4.0/")
    expect(result).toEqual("CC BY 4.0")
  })
  it("getLicenseLabel: no match", () => {
    let result = getLicenseLabel("https://some/license/xxx/3.1/")
    expect(result).toEqual("")
  })
  it("getLicenseLabel: CC BY 4.0 with deed-extension", () => {
    let result = getLicenseLabel(
      "https://creativecommons.org/licenses/by/4.0/deed.de"
    )
    expect(result).toEqual("CC BY 4.0")
  })
  it("getLicenseLabel: CC BY-SA 3.0 with deed-extension", () => {
    let result = getLicenseLabel(
      "https://creativecommons.org/licenses/by-sa/3.0/deed.en"
    )
    expect(result).toEqual("CC BY-SA 3.0")
  })
  it("getLicenseLabel: Apache 2.0", () => {
    let result = getLicenseLabel("https://www.apache.org/licenses/LICENSE-2.0")
    expect(result).toEqual("Apache 2.0")
  })
  it("getLicenseLabel: MIT", () => {
    let result = getLicenseLabel("https://opensource.org/licenses/MIT")
    expect(result).toEqual("MIT")
  })
  it("getLicenseLabel: BSD", () => {
    let result = getLicenseLabel("https://opensource.org/licenses/BSD-3-Clause")
    expect(result).toEqual("BSD-3-Clause")
  })
  it("getLicenseLabel: GPL", () => {
    let result = getLicenseLabel("https://www.gnu.org/licenses/gpl-3.0")
    expect(result).toEqual("GNU GPL 3.0")
  })
  it("getLicenseLabel: AGPL", () => {
    let result = getLicenseLabel("https://www.gnu.org/licenses/agpl")
    expect(result).toEqual("GNU AGPL")
  })

  it("getFieldValuesFromRecord: list value", () => {
    let result = getValuesFromRecord({field: "keywords"}, {keywords: ["A", "B"]})
    expect(result).toEqual([{field: ["A", "B"]}])
  })
  it("getFieldValuesFromRecord: sublist list single values", () => {
    let result = getValuesFromRecord(
      {field: "mainEntityOfPage.provider.name"},
      {
        mainEntityOfPage: [{provider: {name: "A"}}, {provider: {name: "B"}}],
      }
    )
    expect(result).toEqual([{field: "A"}, {field: "B"}])
  })
  it("getFieldValuesFromRecord: sublist list multiple values", () => {
    let result = getValuesFromRecord(
      {field: "firstList.secondList"},
      {
        firstList: [{secondList: ["A", "B"]}, {secondList: ["C", "D"]}],
      }
    )
    expect(result).toEqual([{field: ["A", "B"]}, {field: ["C", "D"]}])
  })
  it("getFieldValuesFromRecord: multiple fields", () => {
    let result = getValuesFromRecord(
      {field: "mainEntityOfPage.provider.name", second: "mainEntityOfPage.id"},
      {
        mainEntityOfPage: [
          {id: "X", provider: {name: "A"}},
          {id: "Y", provider: {name: "B"}},
        ],
      }
    )
    expect(result).toEqual([
      {field: "A", second: "X"},
      {field: "B", second: "Y"},
    ])
  })
  it("getFieldValuesFromRecord: multiple fields multiple values", () => {
    let result = getValuesFromRecord(
      {field: "firstList.secondList", second: "firstList.aValue"},
      {
        firstList: [
          {secondList: ["A", "B"], aValue: "X"},
          {secondList: ["C", "D"], aValue: "Y"},
          {secondList: ["E"]},
        ],
      }
    )
    expect(result).toEqual([
      {field: ["A", "B"], second: "X"},
      {field: ["C", "D"], second: "Y"},
      {field: ["E"], second: ""},
    ])
  })
  it("getFieldValuesFromRecord: multilingual values", () => {
    let result = getValuesFromRecord(
      {field: "name"},
      {
        name: [
          {language: "de", value: "test de"},
          {language: "en", value: "test en"},
        ],
      }
    )
    expect(result).toEqual([
      {
        field: [
          {language: "de", value: "test de"},
          {language: "en", value: "test en"},
        ],
      },
    ])
  })
  const multilingualOptionField = {
    multilingual: {
      languageSelectionType: "field", // field / map
      languageSelectionField: "language",
      valueField: "value",
    },
  }
  const multilingualOptionMap = {
    multilingual: {
      languageSelectionType: "map",
    },
  }
  it("processFieldOption: get fallback for multilingual field of type field selection", () => {
    let result = processFieldOption("test", multilingualOptionField, translateDummy)
    expect(result).toEqual("test")
    result = processFieldOption(
      ["test1", "test2"],
      multilingualOptionField,
      translateDummy
    )
    expect(result).toEqual(["test1", "test2"])
  })
  it("processFieldOption: get fallback for multilingual field of type map selection", () => {
    let result = processFieldOption("test", multilingualOptionMap, translateDummy)
    expect(result).toEqual("test")
    result = processFieldOption(
      ["test1", "test2"],
      multilingualOptionMap,
      translateDummy
    )
    expect(result).toEqual(["test1", "test2"])
  })
  it("processFieldOption: get single value from multilingual field of type map selection", () => {
    i18next.changeLanguage("de")
    let result = processFieldOption(
      {de: "test de", en: "test en"},
      multilingualOptionMap,
      translateDummy
    )
    expect(result).toEqual("test de")
    i18next.changeLanguage("en") // back to english again
  })
  it("processFieldOption: get single value for fallback language from multilingual field of type map selection", () => {
    i18next.changeLanguage("al")
    let result = processFieldOption(
      {de: "test de", en: "test en"},
      multilingualOptionMap,
      translateDummy
    )
    expect(result).toEqual("test en")
    i18next.changeLanguage("en") // back to english again
  })
  it("processFieldOption: get single value for non supported language from multilingual field of type map selection", () => {
    let result = processFieldOption(
      {el: "test el"},
      multilingualOptionMap,
      translateDummy
    )
    expect(result).toEqual("test el")
  })
  it("processFieldOption: get multiple values for non supported language from multilingual field of type map selection", () => {
    let result = processFieldOption(
      [{el: "test1 el"}, {al: "test2 al"}, "test3"],
      multilingualOptionMap,
      translateDummy
    )
    expect(result).toEqual(["test1 el", "test2 al", "test3"])
  })
  it("processFieldOption: get multiple values from multilingual field of type map selection", () => {
    i18next.changeLanguage("de")
    let result = processFieldOption(
      [
        {de: "test1 de", en: "test1 en"},
        {de: "test2 de", en: "test2 en"},
      ],
      multilingualOptionMap,
      translateDummy
    )
    expect(result).toEqual(["test1 de", "test2 de"])
    i18next.changeLanguage("en") // back to english again
  })
  it("processFieldOption: get mixed multiple values from multilingual field of type map selection", () => {
    i18next.changeLanguage("de")
    let result = processFieldOption(
      [{de: "test1 de", en: "test1 en"}, {en: "test2 en"}],
      multilingualOptionMap,
      translateDummy
    )
    expect(result).toEqual(["test1 de", "test2 en"])
    i18next.changeLanguage("en") // back to english again
  })
  it("processFieldOption: get multiple values from multilingual field of type map selection with a fallback in the list", () => {
    i18next.changeLanguage("de")
    let result = processFieldOption(
      [{de: "test1 de", en: "test1 en"}, "test2"],
      multilingualOptionMap,
      translateDummy
    )
    expect(result).toEqual(["test1 de", "test2"])
    i18next.changeLanguage("en") // back to english again
  })
  it("processFieldOption: get multiple values for fallback language from multilingual field of type map selection", () => {
    i18next.changeLanguage("al")
    let result = processFieldOption(
      [
        {de: "test1 de", en: "test1 en"},
        {de: "test2 de", en: "test2 en"},
      ],
      multilingualOptionMap,
      translateDummy
    )
    expect(result).toEqual(["test1 en", "test2 en"])
    i18next.changeLanguage("en") // back to english again
  })
  it("processFieldOption: get single value from multilingual field of type field selection", () => {
    i18next.changeLanguage("de")
    let result = processFieldOption(
      [
        {language: "de", value: "test de"},
        {language: "en", value: "test en"},
      ],
      multilingualOptionField,
      translateDummy
    )
    expect(result).toEqual("test de")
    i18next.changeLanguage("en") // back to english again
  })
  it("processFieldOption: get single value for fallback language from multilingual field of type field selection", () => {
    i18next.changeLanguage("al")
    let result = processFieldOption(
      [
        {language: "de", value: "test de"},
        {language: "en", value: "test en"},
      ],
      multilingualOptionField,
      translateDummy
    )
    expect(result).toEqual("test en")
    i18next.changeLanguage("en") // back to english again
  })
  it("processFieldOption: get single value for non supported language from multilingual field of type field selection", () => {
    let result = processFieldOption(
      [{language: "el", value: "test el"}],
      multilingualOptionField,
      translateDummy
    )
    expect(result).toEqual("test el")
  })
  it("processFieldOption: get multiple values for non supported language from multilingual field of type field selection", () => {
    let result = processFieldOption(
      [
        [{language: "el", value: "test1 el"}],
        [{language: "al", value: "test2 al"}],
        "test3",
      ],
      multilingualOptionField,
      translateDummy
    )
    expect(result).toEqual(["test1 el", "test2 al", "test3"])
  })
  it("processFieldOption: get multiple values from multilingual field of type field selection", () => {
    i18next.changeLanguage("de")
    let result = processFieldOption(
      [
        [
          {language: "de", value: "test1 de"},
          {language: "en", value: "test1 en"},
        ],
        [
          {language: "de", value: "test2 de"},
          {language: "en", value: "test2 en"},
        ],
      ],
      multilingualOptionField,
      translateDummy
    )
    expect(result).toEqual(["test1 de", "test2 de"])
    i18next.changeLanguage("en") // back to english again
  })
  it("processFieldOption: get multiple mixed values from multilingual field of type field selection", () => {
    i18next.changeLanguage("de")
    let result = processFieldOption(
      [
        [
          {language: "de", value: "test1 de"},
          {language: "en", value: "test1 en"},
        ],
        [{language: "en", value: "test2 en"}],
      ],
      multilingualOptionField,
      translateDummy
    )
    expect(result).toEqual(["test1 de", "test2 en"])
    i18next.changeLanguage("en") // back to english again
  })
  it("processFieldOption: get multiple values from multilingual field of type field selection with a fallback in the list", () => {
    i18next.changeLanguage("de")
    let result = processFieldOption(
      [
        [
          {language: "de", value: "test1 de"},
          {language: "en", value: "test1 en"},
        ],
        "test2",
      ],
      multilingualOptionField,
      translateDummy
    )
    expect(result).toEqual(["test1 de", "test2"])
    i18next.changeLanguage("en") // back to english again
  })
  it("processFieldOption: get multiple values for fallback language from multilingual field of type field selection", () => {
    i18next.changeLanguage("el")
    let result = processFieldOption(
      [
        [
          {language: "de", value: "test1 de"},
          {language: "en", value: "test1 en"},
        ],
        [
          {language: "de", value: "test2 de"},
          {language: "en", value: "test2 en"},
        ],
      ],
      multilingualOptionField,
      translateDummy
    )
    expect(result).toEqual(["test1 en", "test2 en"])
    i18next.changeLanguage("en") // back to english again
  })
})
