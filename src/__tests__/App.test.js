import React from "react"
import config from "react-global-configuration"
import App from "../App"
import prod from "../config/prod"
import {OersiConfigContext} from "../helpers/use-context"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import {MemoryRouter} from "react-router-dom"
import {render, screen} from "@testing-library/react"
import {getTheme} from "../Configuration"
import {ThemeProvider} from "@mui/material"

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
}))

beforeAll(() => {
  config.set(prod)
})

describe("App", () => {
  const AppWithConfig = (props) => {
    return (
      <OersiConfigContext.Provider value={props.appConfig}>
        <ThemeProvider theme={getTheme(!!props.isDarkMode)}>
          <MemoryRouter>
            <App config={config} />
          </MemoryRouter>
        </ThemeProvider>
      </OersiConfigContext.Provider>
    )
  }
  const getFeatureConfig = (features) => {
    let configModified = Object.assign({}, defaultConfig.GENERAL_CONFIGURATION)
    configModified.FEATURES = features
    return configModified
  }

  it("should render without crashing", async () => {
    render(<AppWithConfig appConfig={defaultConfig.GENERAL_CONFIGURATION} />)
    expect(screen.queryByRole("link", {name: "OERSI-TITLE"})).toBeInTheDocument()
  })

  it("should render without crashing in dark mode", async () => {
    render(
      <AppWithConfig
        isDarkMode={true}
        appConfig={defaultConfig.GENERAL_CONFIGURATION}
      />
    )
    expect(screen.queryByRole("link", {name: "OERSI-TITLE"})).toBeInTheDocument()
  })

  it("should include top-anchor, if feature activated", () => {
    const result = render(
      <AppWithConfig appConfig={getFeatureConfig({SCROLL_TOP_BUTTON: true})} />
    )
    const labelNodes = Array.from(result.container.querySelectorAll("#top-anchor"))
    expect(labelNodes).toHaveLength(1)
  })
})
