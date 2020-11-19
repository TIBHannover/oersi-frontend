import React from "react"
import i18n from "i18next"
import i18next from "i18next"
import {initReactI18next} from "react-i18next"
import {
  getLabelForLanguage,
  getLabelForStandardComponent,
} from "../../../helpers/helpers"

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: ["en", "de"],
  resources: {
    en: {},
  },
})

function translateDummy(key, options) {
  return key + "_translated"
}

describe("helpers", () => {
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
})
