import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import React from "react"
import Contact from "../../views/Contact"
import {act, render, screen} from "@testing-library/react"
import {OersiConfigContext} from "../../helpers/use-context"
import {MemoryRouter} from "react-router-dom"
import userEvent from "@testing-library/user-event"

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  // have a common namespace used around the full app
  ns: ["translation"],
  defaultNS: "translation",
  resources: {
    en: {
      labelledConcept: {
        "https://w3id.org/kim/hcrt/video": "Video",
        "http://purl.org/dcx/lrmi-vocabs/educationalAudienceRole/teacher": "Teacher",
      },
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
  const renderDefault = () => {
    return render(
      <OersiConfigContext.Provider value={defaultConfig}>
        <MemoryRouter initialEntries={["/resources/services/contact"]}>
          <Contact />
        </MemoryRouter>
      </OersiConfigContext.Provider>
    )
  }
  const prepareSubmit = async (changeSubject = true) => {
    const mail = screen.getByRole("textbox", {name: "CONTACT.MAIL_LABEL"})
    const subject = screen.getByRole("textbox", {name: "CONTACT.SUBJECT_LABEL"})
    const message = screen.getByRole("textbox", {name: "CONTACT.MESSAGE_LABEL"})
    const submit = screen.getByRole("button", {name: "LABEL.SUBMIT"})
    const checkbox = screen.getByRole("checkbox", {
      name: "CONTACT.READ_PRIVACY_POLICY",
    })

    await userEvent.type(mail, "test@test.org")
    if (changeSubject) {
      await userEvent.type(subject, "General question")
    }
    await userEvent.type(message, "test message")
    await userEvent.click(checkbox)
    return submit
  }

  it("contact render default", () => {
    renderDefault()
    const submit = screen.getByRole("button", {name: "LABEL.SUBMIT"})
    const checkbox = screen.getByRole("checkbox", {
      name: "CONTACT.READ_PRIVACY_POLICY",
    })

    expect(submit).toBeDisabled()
    expect(checkbox).not.toBeChecked()
  })
  //
  it("contact checkbox checked", async () => {
    renderDefault()
    const submit = screen.getByRole("button", {name: "LABEL.SUBMIT"})
    const checkbox = screen.getByRole("checkbox", {
      name: "CONTACT.READ_PRIVACY_POLICY",
    })

    await userEvent.click(checkbox)

    expect(submit).not.toBeDisabled()
    expect(checkbox).toBeChecked()
  })

  it("report record contact request", async () => {
    mockSubmit()
    render(
      <OersiConfigContext.Provider value={defaultConfig}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/resources/services/contact",
              state: {reportRecordId: "id", reportRecordName: "testname"},
            },
          ]}
        >
          <Contact />
        </MemoryRouter>
      </OersiConfigContext.Provider>
    )

    const subject = screen.getByRole("textbox", {name: "CONTACT.SUBJECT_LABEL"})

    expect(subject).toBeDisabled()
    expect(subject.getAttribute("value")).toMatch("testname")

    global.fetch.mockRestore()
  })

  it("submit contact request", async () => {
    mockSubmit()
    renderDefault()
    const submit = await prepareSubmit()
    await userEvent.click(submit)

    const msg = screen.queryByLabelText("success-message")
    expect(msg).toBeInTheDocument()
    expect(msg).not.toBeEmptyDOMElement()

    global.fetch.mockRestore()
  })

  it("submit report record contact request", async () => {
    mockSubmit()
    render(
      <OersiConfigContext.Provider value={defaultConfig}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/resources/services/contact",
              state: {reportRecordId: "id", reportRecordName: "testname"},
            },
          ]}
        >
          <Contact />
        </MemoryRouter>
      </OersiConfigContext.Provider>
    )
    const submit = await prepareSubmit(false)
    await userEvent.click(submit)

    const msg = screen.queryByLabelText("success-message")
    expect(msg).toBeInTheDocument()
    expect(msg).not.toBeEmptyDOMElement()

    global.fetch.mockRestore()
  })

  it("invalid response from backend", async () => {
    mockSubmit(false, 500, "error")
    renderDefault()
    const submit = await prepareSubmit()
    await userEvent.click(submit)

    const msg = screen.queryByLabelText("error-message")
    expect(msg).toBeInTheDocument()
    expect(msg).not.toBeEmptyDOMElement()

    global.fetch.mockRestore()
  })
})
