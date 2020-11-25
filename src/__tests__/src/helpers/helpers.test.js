import React from "react"
import i18n from "i18next"
import i18next from "i18next"
import {initReactI18next} from "react-i18next"
import getParams, {
  getLabelForLanguage,
  getLabelForStandardComponent,
  getRequestWithLanguage,
  setParams,
} from "../../../helpers/helpers"

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: ["fr", "es", "it", "en", "de"],
  resources: {
    en: {},
  },
})

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

  it("getLabelForLanguage : retrieve common language labels", () => {
    let label = getLabelForLanguage("de", "de", ["en", "de"])
    expect(label).toEqual("Deutsch")
    label = getLabelForLanguage("de", "en", ["en", "de"])
    expect(label).toEqual("German")
  })
  it("getLabelForLanguage : retrieve language labels for null value", () => {
    let label = getLabelForLanguage(null, "en", ["en", "de"])
    expect(label).toEqual(null)
  })
  it("getLabelForLanguage : retrieve language labels for not translatable value", () => {
    let label = getLabelForLanguage("undefined", "en", ["en", "de"])
    expect(label).toEqual("undefined")
  })
  it("getLabelForLanguage : use fallback language if translate lng has no result", () => {
    let label = getLabelForLanguage("de", "xx", ["xx", "xy", "de"])
    expect(label).toEqual("Deutsch")
  })

  it("getLabelForStandardComponent : component language", () => {
    let label = getLabelForStandardComponent("de", "language", translateDummy)
    expect(label).toEqual("German")
  })
  it("getLabelForStandardComponent : component license", () => {
    let label = getLabelForStandardComponent(
      "https://creativecommons.org/publicdomain/zero/1.0",
      "license",
      translateDummy
    )
    expect(label).toEqual("ZERO")
  })
  it("getLabelForStandardComponent : component with translations", () => {
    let label = getLabelForStandardComponent("TEST", "provider", translateDummy)
    expect(label).toEqual("provider:TEST_translated")
    label = getLabelForStandardComponent(
      "TEST",
      "learningResourceType",
      translateDummy
    )
    expect(label).toEqual("lrt#TEST_translated")
    label = getLabelForStandardComponent("TEST", "about", translateDummy)
    expect(label).toEqual("subject#TEST_translated")
  })
  it("getLabelForStandardComponent : component other", () => {
    let label = getLabelForStandardComponent(
      "TESTLABEL",
      "other_xxx",
      translateDummy
    )
    expect(label).toEqual("TESTLABEL")
  })
  it("getRequestWithLanguage : Default language is ' ', repeat until it find language 'en'  ", () => {
    i18next.changeLanguage(null)
    getRequestWithLanguage(callBackForTest)
    i18next.changeLanguage("en") // back to english again
  })

  it("getRequestWithLanguage : Default language is 'en', http status 200  ", () => {
    i18next.changeLanguage("de")
    getRequestWithLanguage(callBackForTest)
    i18next.changeLanguage("en") // back to english again
  })

  it("getRequestWithLanguage : Default Language is 'al',  http status 404, repeat until it find language 'en' ", () => {
    i18next.changeLanguage("al")
    getRequestWithLanguage(callBackForTest)
    i18next.changeLanguage("en") // back to english again
  })

  async function callBackForTest(lang) {
    const result = lang
    if (result === "en") {
      expect(result).toEqual(i18next.language)
      return true
    }
    return false
  }
})
