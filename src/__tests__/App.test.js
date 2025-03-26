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
    PUBLIC_URL: "http://localhost/resources",
    AVAILABLE_LANGUAGES: ["de", "en"],
    FEATURES: {},
  },
}

jest.mock("@appbaseio/reactivesearch", () => ({
  ReactiveBase: ({children}) => <div data-testid="ReactiveBase">{children}</div>,
  DataSearch: () => <div />,
  MultiList: () => <div />,
  ReactiveList: () => <div />,
  SelectedFilters: () => <div />,
  SingleDataList: () => <div />,
  StateProvider: () => <div />,
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
})
