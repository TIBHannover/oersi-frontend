import React from "react"
import CookieNotice from "../../components/CookieNotice"
import {I18nextProvider} from "react-i18next"
import i18next from "i18next"
import {initReactI18next} from "react-i18next"
import {OersiConfigContext} from "../../helpers/use-context"
import {act, render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"

const fakeTranslated = {
  COOKIE: {
    TITLE:
      "Diese Website verwendet Cookies, um Ihnen die bestmögliche Nutzung unserer Website zu gewährleisten. Durch die Nutzung dieser Website erklären Sie sich mit dieser Nutzung einverstanden.",
    MORE_INFO: "Mehr Info",
    BUTTON_ACCEPT: "Akzeptiere",
  },
}

window["runTimeConfig"] = {
  ELASTIC_SEARCH: {},
  GENERAL_CONFIGURATION: {
    PRIVACY_POLICY_LINK: [
      {path: "en/privacyPolicy.html", language: "en"},
      {path: "en/privacyPolicy.html", language: "de"},
      {path: "http://my-domain.de/", language: "sq"},
    ],
  },
}

i18next.use(initReactI18next).init({
  lng: "en",
  fallbackLng: ["en", "de", "sq", "fr"],
  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",
  debug: false,
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
  resources: {
    en: {translations: fakeTranslated},
  },
})

describe("Cookie ==> Test UI  ", () => {
  it("Cookie : should render without crashing ", () => {
    act(() => {
      render(
        <I18nextProvider i18n={i18next}>
          <OersiConfigContext.Provider
            value={window["runTimeConfig"].GENERAL_CONFIGURATION}
          >
            <CookieNotice />
          </OersiConfigContext.Provider>
        </I18nextProvider>
      )
    })
  })

  it("Cookie : should be translated ", () => {
    act(() => {
      render(
        <I18nextProvider i18n={i18next}>
          <OersiConfigContext.Provider
            value={window["runTimeConfig"].GENERAL_CONFIGURATION}
          >
            <CookieNotice />
          </OersiConfigContext.Provider>
        </I18nextProvider>
      )
    })
    const labelNode = screen.getByLabelText("cookieConsent")
    expect(labelNode).toHaveTextContent(fakeTranslated.COOKIE.TITLE)
  })
  it("Cookie : should be have a link in base of language 'en' ", () => {
    act(() => {
      render(
        <I18nextProvider i18n={i18next}>
          <OersiConfigContext.Provider
            value={window["runTimeConfig"].GENERAL_CONFIGURATION}
          >
            <CookieNotice />
          </OersiConfigContext.Provider>
        </I18nextProvider>
      )
    })

    const node = screen.getByRole("link")
    expect(node.href.replace("http://localhost/", "")).toEqual(
      window["runTimeConfig"].GENERAL_CONFIGURATION.PRIVACY_POLICY_LINK[0].path
    )
  })

  it("Cookie : should be have a link in base of language 'de' ", () => {
    i18next.changeLanguage("de")
    act(() => {
      render(
        <I18nextProvider i18n={i18next}>
          <OersiConfigContext.Provider
            value={window["runTimeConfig"].GENERAL_CONFIGURATION}
          >
            <CookieNotice />
          </OersiConfigContext.Provider>
        </I18nextProvider>
      )
    })
    const node = screen.getByRole("link")
    expect(node.href.replace("http://localhost/", "")).toEqual(
      window["runTimeConfig"].GENERAL_CONFIGURATION.PRIVACY_POLICY_LINK[1].path
    )
  })

  it("Cookie : should go to fallback language for language 'non' ", () => {
    i18next.changeLanguage("non")
    act(() => {
      render(
        <I18nextProvider i18n={i18next}>
          <OersiConfigContext.Provider
            value={window["runTimeConfig"].GENERAL_CONFIGURATION}
          >
            <CookieNotice />
          </OersiConfigContext.Provider>
        </I18nextProvider>
      )
    })
    const node = screen.getByRole("link")
    expect(node.href.replace("http://localhost/", "")).toEqual(
      window["runTimeConfig"].GENERAL_CONFIGURATION.PRIVACY_POLICY_LINK[0].path
    )
  })

  it("Cookie : should have a link for language 'sq' ", () => {
    i18next.changeLanguage("sq")
    act(() => {
      render(
        <I18nextProvider i18n={i18next}>
          <OersiConfigContext.Provider
            value={window["runTimeConfig"].GENERAL_CONFIGURATION}
          >
            <CookieNotice />
          </OersiConfigContext.Provider>
        </I18nextProvider>
      )
    })
    const node = screen.getByRole("link")
    expect(node.href).toEqual(
      window["runTimeConfig"].GENERAL_CONFIGURATION.PRIVACY_POLICY_LINK[2].path
    )
  })
  it("Cookie : Should return undefined for empty links ", () => {
    i18next.changeLanguage("sq")
    act(() => {
      render(
        <I18nextProvider i18n={i18next}>
          <OersiConfigContext.Provider value={{PRIVACY_POLICY_LINK: []}}>
            <CookieNotice />
          </OersiConfigContext.Provider>
        </I18nextProvider>
      )
    })
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })

  it("Cookie : Should accept the cookie, oerndsCookieInfoDismissed=true ", () => {
    act(() => {
      render(
        <I18nextProvider i18n={i18next}>
          <OersiConfigContext.Provider
            value={window["runTimeConfig"].GENERAL_CONFIGURATION}
          >
            <CookieNotice />
          </OersiConfigContext.Provider>
        </I18nextProvider>
      )
    })
    const button = screen.getByRole("button")
    userEvent.click(button)
    expect(document.cookie).toEqual("oerndsCookieInfoDismissed=true")
  })
})
