import React from "react"
import App from "../App"
import {getDefaultSearchConfiguration} from "./helpers/test-helpers"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import {MemoryRouter} from "react-router"
import {render, screen} from "@testing-library/react"

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
    routes: {
      CONTACT: "/services/contact",
      DETAILS_BASE: "/",
      HOME_PAGE: "/home",
      SEARCH: "/",
    },
    PUBLIC_URL: "http://localhost/resources",
    AVAILABLE_LANGUAGES: ["de", "en"],
    FEATURES: {CONTACT_PAGE: true},
    RESULT_PAGE_SIZE_OPTIONS: ["12", "24"],
    NR_OF_RESULT_PER_PAGE: 12,
  },
}

jest.mock("react-instantsearch", () => ({
  useCurrentRefinements: () => ({items: [], refine: jest.fn()}),
  useClearRefinements: () => ({}),
  useHits: () => ({result: {hitsPerPage: 12}, items: []}),
  useHitsPerPage: () => ({refine: jest.fn()}),
  useInstantSearch: () => ({}),
  usePagination: () => ({nbHits: 100, currentRefinement: 0, refine: jest.fn()}),
  useRefinementList: () => ({items: [], refine: jest.fn()}),
  useSearchBox: () => ({query: "abc", refine: jest.fn()}),
  useStats: () => ({nbHits: 100}),
  useToggleRefinement: () => ({
    value: {isRefined: false, count: 100},
    refine: jest.fn(),
  }),
}))

describe("App", () => {
  const AppWithConfig = (props) => {
    return (
      <SearchIndexFrontendConfigContext.Provider
        value={{
          ...props.appConfig,
          searchConfiguration: getDefaultSearchConfiguration(),
        }}
      >
        <MemoryRouter
          initialEntries={
            props.initialRouterEntries ? props.initialRouterEntries : ["/"]
          }
        >
          <App />
        </MemoryRouter>
      </SearchIndexFrontendConfigContext.Provider>
    )
  }
  const getFeatureConfig = (features) => {
    let configModified = Object.assign({}, defaultConfig.GENERAL_CONFIGURATION)
    configModified.FEATURES = features
    return configModified
  }

  it("should render without crashing", async () => {
    render(<AppWithConfig appConfig={defaultConfig.GENERAL_CONFIGURATION} />)
    expect(screen.queryByRole("link", {name: "SIDRE-TITLE"})).toBeInTheDocument()
  })

  it("should render without crashing with sidebar drawer", async () => {
    render(
      <AppWithConfig
        appConfig={{
          ...defaultConfig.GENERAL_CONFIGURATION,
          isFilterViewOpen: true,
        }}
      />
    )
    expect(screen.queryByRole("link", {name: "SIDRE-TITLE"})).toBeInTheDocument()
  })

  it("should render without crashing in dark mode", async () => {
    render(
      <AppWithConfig
        isDarkMode={true}
        appConfig={defaultConfig.GENERAL_CONFIGURATION}
      />
    )
    expect(screen.queryByRole("link", {name: "SIDRE-TITLE"})).toBeInTheDocument()
  })

  it("should include top-anchor, if feature activated", () => {
    const result = render(
      <AppWithConfig appConfig={getFeatureConfig({SCROLL_TOP_BUTTON: true})} />
    )
    const labelNodes = Array.from(result.container.querySelectorAll("#top-anchor"))
    expect(labelNodes).toHaveLength(1)
  })

  it("should render without crashing for non-search-views", async () => {
    render(
      <AppWithConfig
        initialRouterEntries={["/services/contact"]}
        appConfig={defaultConfig.GENERAL_CONFIGURATION}
      />
    )
    expect(screen.getByRole("link", {name: "SIDRE-TITLE"})).toBeInTheDocument()
  })

  it("back button for non-searchview", async () => {
    render(
      <AppWithConfig
        initialRouterEntries={["/services/contact"]}
        appConfig={defaultConfig.GENERAL_CONFIGURATION}
      />
    )
    const backButton = screen.getByRole("button", {name: "back to previous page"})
    expect(backButton).toBeInTheDocument()
  })

  it("no back button for searchview", async () => {
    render(
      <AppWithConfig
        initialRouterEntries={["/"]}
        appConfig={defaultConfig.GENERAL_CONFIGURATION}
      />
    )
    const backButton = screen.queryByRole("button", {name: "back to previous page"})
    expect(backButton).not.toBeInTheDocument()
  })
})
