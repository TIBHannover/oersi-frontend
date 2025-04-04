import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import React from "react"
import {render, screen} from "@testing-library/react"
import {SearchIndexFrontendConfigContext} from "../../helpers/use-context"
import {MemoryRouter} from "react-router"
import Home from "../../views/Home"

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  // have a common namespace used around the full app
  ns: ["translation"],
  defaultNS: "translation",
  resources: {
    en: {
      HOME: {
        KEYWORDS: ["free to use", "keyword2", "keyword3"],
      },
    },
    de: {
      HOME: {
        KEYWORDS: ["freie Nutzung", "keyword2", "keyword3"],
      },
    },
  },
})
const defaultConfig = {
  PRIVACY_POLICY_LINK: [],
  FEATURES: {HOME_PAGE: true},
  homePage: {
    features: [
      {
        labelKey: "HOME.FEATURE_1",
        links: [{url: {de: "#de", en: "#en"}, labelKey: "LINK_1"}],
      },
      {
        labelKey: "HOME.FEATURE_2",
        links: [{url: {de: "#de", en: "#en"}, labelKey: "LINK_1"}],
      },
    ],
  },
}

describe("Contact", () => {
  const renderDefault = () => {
    return render(
      <SearchIndexFrontendConfigContext.Provider value={defaultConfig}>
        <MemoryRouter initialEntries={["/resources/home"]}>
          <Home />
        </MemoryRouter>
      </SearchIndexFrontendConfigContext.Provider>
    )
  }

  it("home render default", () => {
    renderDefault()
    const search = screen.getByRole("textbox", {name: "search"})

    expect(search).toBeInTheDocument()
  })

  it("home features", () => {
    renderDefault()
    const link1 = screen.getByRole("link", {name: "HOME.FEATURE_1.LINK_1"})
    expect(link1).toBeInTheDocument()
    const link2 = screen.getByRole("link", {name: "HOME.FEATURE_2.LINK_1"})
    expect(link2).toBeInTheDocument()
  })
})
