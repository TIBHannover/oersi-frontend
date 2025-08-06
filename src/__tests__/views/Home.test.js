import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import React from "react"
import {render, screen} from "@testing-library/react"
import {SearchIndexFrontendConfigContext} from "../../helpers/use-context"
import {MemoryRouter} from "react-router"
import Home from "../../views/Home"
import userEvent from "@testing-library/user-event"

const mockNavigate = jest.fn()
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}))
jest.mock("react-instantsearch", () => ({
  useStats: () => {
    return {nbHits: 100}
  },
  useSearchBox: () => ({query: "abc", refine: jest.fn()}),
}))

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
  routes: {
    CONTACT: "/services/contact",
    DETAILS_BASE: "/",
    HOME_PAGE: "/home",
    SEARCH: "/",
  },
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

describe("Home", () => {
  const renderDefault = (config) => {
    return render(
      <SearchIndexFrontendConfigContext.Provider value={config || defaultConfig}>
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
    const link1 = screen.getByRole("button", {name: "HOME.FEATURE_1.LINK_1"})
    expect(link1).toBeInTheDocument()
    const link2 = screen.getByRole("button", {name: "HOME.FEATURE_2.LINK_1"})
    expect(link2).toBeInTheDocument()
  })

  it("submit search", async () => {
    renderDefault()

    const search = screen.getByRole("textbox", {name: "search"})
    await userEvent.type(search, "searchterm")
    const searchButton = screen.getByRole("button", {name: "Search"})
    await userEvent.click(searchButton)
    expect(mockNavigate).toBeCalled()
  })

  it("home render with activated stats", () => {
    const config = {
      ...defaultConfig,
      homePage: {
        ...defaultConfig.homePage,
        useStats: true,
      },
    }
    renderDefault(config)
    const search = screen.getByRole("textbox", {name: "search"})

    expect(search).toBeInTheDocument()
  })
})
