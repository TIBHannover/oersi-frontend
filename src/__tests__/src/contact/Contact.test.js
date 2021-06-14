import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import React from "react"
import Contact from "../../../components/contact/Contact"
import {fireEvent, render} from "@testing-library/react"
import {ConfigurationRunTime} from "../../../helpers/use-context"

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  // have a common namespace used around the full app
  ns: ["translation"],
  defaultNS: "translation",
  resources: {
    en: {
      lrt: {
        "https://w3id.org/kim/hcrt/video": "Video",
      },
      language: {
        de: "German",
        en: "English",
      },
      audience: {
        "http://purl.org/dcx/lrmi-vocabs/educationalAudienceRole/teacher": "Teacher",
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
const defaultConfig = {
  GENERAL_CONFIGURATION: {
    PRIVACY_POLICY_LINK: [],
    FEATURES: {},
  },
}

describe("Contact", () => {
  it("contact render default", () => {
    const {getByTestId} = render(
      <ConfigurationRunTime.Provider value={defaultConfig}>
        <Contact />
      </ConfigurationRunTime.Provider>
    )

    const submit = getByTestId("contact-submit-button")
    const checkbox = getByTestId("contact-privacy-checkbox")

    expect(submit).toHaveClass("Mui-disabled")
    expect(checkbox).not.toHaveClass("Mui-checked")
  })
  //
  it("contact checkbox checked", () => {
    const {getByTestId} = render(
      <ConfigurationRunTime.Provider value={defaultConfig}>
        <Contact />
      </ConfigurationRunTime.Provider>
    )

    const submit = getByTestId("contact-submit-button")
    const checkbox = getByTestId("contact-privacy-checkbox")

    fireEvent.click(checkbox.querySelector('input[type="checkbox"]'))

    expect(submit).not.toHaveClass("Mui-disabled")
    expect(checkbox).toHaveClass("Mui-checked")
  })
})
