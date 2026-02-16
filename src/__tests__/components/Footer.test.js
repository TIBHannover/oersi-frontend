import React from "react"
import Footer from "../../components/Footer"
import {SearchIndexFrontendConfigContext} from "../../helpers/use-context"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import {act, render, screen, waitFor} from "@testing-library/react"
import {MemoryRouter} from "react-router"
const footerFakehtml = "<footer><p>this is a test<p></footer>"

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
  },
})

describe("Footer ==> Test UI  ", () => {
  it("Footer : should render deprecated custom footer without crashing and render HTML ", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        text: () => footerFakehtml,
      })
    )
    await act(() =>
      waitFor(() =>
        render(
          <SearchIndexFrontendConfigContext.Provider value={{PUBLIC_BASE_PATH: "/"}}>
            <Footer />
          </SearchIndexFrontendConfigContext.Provider>
        )
      )
    )

    expect(screen.queryByRole("contentinfo")).toBeInTheDocument()

    global.fetch.mockRestore()
  })
  it("Footer : should render deprecated custom footer without crashing with wrong render HTML", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 200,
        text: () => "<html><head><body></>Footer not find</p></body></head></html>",
      })
    )
    await waitFor(() =>
      render(
        <SearchIndexFrontendConfigContext.Provider value={{PUBLIC_BASE_PATH: "/"}}>
          <Footer />
        </SearchIndexFrontendConfigContext.Provider>
      )
    )
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument()

    global.fetch.mockRestore()
  })

  it("Footer : should render deprecated custom footer without crashing without render HTML", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        text: () => "<html><head><body></>Footer not find</p></body></head></html>",
      })
    )
    await waitFor(() =>
      render(
        <SearchIndexFrontendConfigContext.Provider value={{PUBLIC_BASE_PATH: "/"}}>
          <Footer />
        </SearchIndexFrontendConfigContext.Provider>
      )
    )
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument()

    global.fetch.mockRestore()
  })

  it("Footer : should render default footer", async () => {
    await act(() =>
      waitFor(() =>
        render(
          <SearchIndexFrontendConfigContext.Provider
            value={{PUBLIC_BASE_PATH: "/", FEATURES: {CUSTOM_FOOTER: false}}}
          >
            <Footer />
          </SearchIndexFrontendConfigContext.Provider>
        )
      )
    )
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
  })

  it("Footer : should render default footer links", async () => {
    await act(() =>
      waitFor(() =>
        render(
          <MemoryRouter initialEntries={["/"]}>
            <SearchIndexFrontendConfigContext.Provider
              value={{
                PUBLIC_BASE_PATH: "/",
                FEATURES: {CUSTOM_FOOTER: false},
                footer: {
                  links: [
                    {
                      iconId: "Envelope",
                      labelKey: "CONTACT.TITLE",
                      href: "/services/contact",
                    },
                    {
                      iconId: "GitLab",
                      label: "GitLab",
                      href: "/gitlab",
                      target: "_blank",
                    },
                  ],
                  imprint: {
                    de: "/pages/de/imprint/",
                    en: "/pages/en/imprint/",
                  },
                  privacyPolicy: {
                    de: "/pages/de/privacy_policy/",
                    en: "/pages/en/privacy_policy/",
                  },
                  accessibilityStatement: {
                    de: "/pages/de/accessibility/",
                    en: "/pages/en/accessibility/",
                  },
                },
              }}
            >
              <Footer />
            </SearchIndexFrontendConfigContext.Provider>
          </MemoryRouter>
        )
      )
    )
    expect(screen.getByRole("link", {name: "CONTACT.TITLE"})).toHaveAttribute(
      "href",
      "/services/contact"
    )
    expect(screen.getByRole("link", {name: "GitLab"})).toHaveAttribute(
      "href",
      "/gitlab"
    )
    expect(screen.getByRole("link", {name: "FOOTER.IMPRINT"})).toHaveAttribute(
      "href",
      "/pages/en/imprint/"
    )
    expect(screen.getByRole("link", {name: "FOOTER.ACCESSIBILITY"})).toHaveAttribute(
      "href",
      "/pages/en/accessibility/"
    )
    expect(
      screen.getByRole("link", {name: "FOOTER.PRIVACY_POLICY"})
    ).toHaveAttribute("href", "/pages/en/privacy_policy/")
  })

  it("Footer : should render default footer logos", async () => {
    await act(() =>
      waitFor(() =>
        render(
          <MemoryRouter initialEntries={["/"]}>
            <SearchIndexFrontendConfigContext.Provider
              value={{
                PUBLIC_BASE_PATH: "/",
                FEATURES: {CUSTOM_FOOTER: false},
                footer: {
                  logos: [
                    {
                      href: {
                        de: "https://example.org/de/",
                        en: "https://example.org/en/",
                      },
                      src: "https://example.org/logo.png",
                      altText: "Logo 1",
                    },
                    {
                      href: "https://example.org/",
                      src: "https://example.org/logo2.png",
                      altText: "Logo 2",
                    },
                  ],
                },
              }}
            >
              <Footer />
            </SearchIndexFrontendConfigContext.Provider>
          </MemoryRouter>
        )
      )
    )
    expect(screen.getByRole("img", {name: "Logo 1"})).toBeInTheDocument()
    expect(screen.getByRole("img", {name: "Logo 2"})).toBeInTheDocument()
    expect(screen.getByRole("link", {name: "Logo 1"})).toHaveAttribute(
      "href",
      "https://example.org/en/"
    )
    expect(screen.getByRole("link", {name: "Logo 2"})).toHaveAttribute(
      "href",
      "https://example.org/"
    )
  })
})
