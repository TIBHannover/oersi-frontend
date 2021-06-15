import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import React from "react"
import Contact from "../../../components/contact/Contact"
import {act, fireEvent, render} from "@testing-library/react"
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
  const mockSubmit = (ok = true, statusCode, statusText) => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: ok,
        status: statusCode,
        statusText: statusText,
      })
    )
  }

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

  it("submit contact request", async () => {
    mockSubmit()
    const {getByTestId} = render(
      <ConfigurationRunTime.Provider value={defaultConfig}>
        <Contact />
      </ConfigurationRunTime.Provider>
    )

    const mail = getByTestId("contact-mail-input")
    const message = getByTestId("contact-message-input")
    const submit = getByTestId("contact-submit-button")
    const checkbox = getByTestId("contact-privacy-checkbox")

    await act(async () => {
      fireEvent.change(mail.querySelector("input"), {
        target: {value: "test@test.org"},
      })
      fireEvent.change(message.querySelector("textarea"), {
        target: {value: "test message"},
      })
      fireEvent.click(checkbox.querySelector('input[type="checkbox"]'))
    })
    await act(async () => {
      fireEvent.click(submit)
    })

    expect(getByTestId("contact-success-message")).not.toBeEmpty()

    global.fetch.mockRestore()
  })

  it("invalid response from backend", async () => {
    mockSubmit(false, 500, "error")
    const {getByTestId} = render(
      <ConfigurationRunTime.Provider value={defaultConfig}>
        <Contact />
      </ConfigurationRunTime.Provider>
    )

    const mail = getByTestId("contact-mail-input")
    const message = getByTestId("contact-message-input")
    const submit = getByTestId("contact-submit-button")
    const checkbox = getByTestId("contact-privacy-checkbox")

    await act(async () => {
      fireEvent.change(mail.querySelector("input"), {
        target: {value: "test@test.org"},
      })
      fireEvent.change(message.querySelector("textarea"), {
        target: {value: "test message"},
      })
      fireEvent.click(checkbox.querySelector('input[type="checkbox"]'))
    })
    await act(async () => {
      fireEvent.click(submit)
    })

    expect(getByTestId("error-message")).toHaveClass("error-message")

    global.fetch.mockRestore()
  })
})
