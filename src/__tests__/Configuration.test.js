import React from "react"
import Configuration from "../Configuration"
import {I18nextProvider} from "react-i18next"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import {getDefaultSearchConfiguration} from "./helpers/test-helpers"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import {act, render, screen} from "@testing-library/react"
import {useMediaQuery, useTheme} from "@mui/material"
import {Cookies} from "react-cookie"
import userEvent from "@testing-library/user-event"

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  // have a common namespace used around the full app
  ns: ["translation"],
  defaultNS: "translation",
  resources: {
    en: {},
  },
})

jest.mock("@appbaseio/reactivesearch", () => ({
  ReactiveBase: ({children}) => <div data-testid="ReactiveBase">{children}</div>,
  DataSearch: () => <div />,
  MultiList: () => <div />,
  ReactiveList: () => <div />,
  SelectedFilters: () => <div />,
  SingleDataList: () => <div />,
}))
jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn(),
}))

const defaultConfig = {
  BACKEND_API: {
    BASE_URL: "https://your.sidre.instance.org",
    PATH_CONTACT: "/resources/api-internal/contact",
    PATH_LABEL: "/resources/api-internal/label",
    PATH_SEARCH: "/resources/api/search",
  },
  ELASTIC_SEARCH_INDEX_NAME: "test_data",
  GENERAL_CONFIGURATION: {},
}
window["runTimeConfig"] = defaultConfig

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      text: () => "",
    })
  )
})
afterEach(() => {
  global.fetch.mockRestore()
})

describe("Configuration ==> Test UI  ", () => {
  it("Configuration : should render without crashing", async () => {
    await i18n.changeLanguage("en")
    window["runTimeConfig"] = {
      GENERAL_CONFIGURATION: {search: getDefaultSearchConfiguration()},
    }
    render(
      <I18nextProvider i18n={i18n}>
        <SearchIndexFrontendConfigContext.Provider value={window["runTimeConfig"]}>
          <Configuration>
            <div>test</div>
          </Configuration>
        </SearchIndexFrontendConfigContext.Provider>
      </I18nextProvider>
    )
  })

  it("Configuration : should render without crashing for German translation", async () => {
    await i18n.changeLanguage("de")
    window["runTimeConfig"] = {
      GENERAL_CONFIGURATION: {search: getDefaultSearchConfiguration()},
    }
    render(
      <I18nextProvider i18n={i18n}>
        <SearchIndexFrontendConfigContext.Provider value={window["runTimeConfig"]}>
          <Configuration>
            <div>test</div>
          </Configuration>
        </SearchIndexFrontendConfigContext.Provider>
      </I18nextProvider>
    )
  })

  const ColorTest = () => {
    const theme = useTheme()
    const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
    return (
      <>
        <div aria-label="primary" style={{fontSize: theme.typography.fontSize}}>
          {theme.palette.primary.main}
        </div>
        <button aria-label="toggle" onClick={frontendConfig.onToggleColorMode} />
        <button
          aria-label="fontsize"
          onClick={() => frontendConfig.onChangeFontSize(18)}
        />
      </>
    )
  }
  const testColor = async (
    config,
    isDarkModePreferred,
    expectedColor,
    toggle = false
  ) => {
    useMediaQuery.mockImplementation(() => isDarkModePreferred)
    window["runTimeConfig"] = {
      ...defaultConfig,
      GENERAL_CONFIGURATION: {search: getDefaultSearchConfiguration(), ...config},
    }
    render(
      <I18nextProvider i18n={i18n}>
        <SearchIndexFrontendConfigContext.Provider value={window["runTimeConfig"]}>
          <Configuration>
            <ColorTest />
          </Configuration>
        </SearchIndexFrontendConfigContext.Provider>
      </I18nextProvider>
    )
    if (toggle) {
      const toggleButton = screen.getByRole("button", {name: "toggle"})
      await userEvent.click(toggleButton)
    }
    const primaryColor = screen.getByLabelText("primary")
    expect(primaryColor).toHaveTextContent(expectedColor)
  }

  const defaultColorConfig = {
    THEME_COLORS: {primary: {main: "#fff"}, secondary: {main: "#fff"}},
    THEME_COLORS_DARK: {primary: {main: "#000"}, secondary: {main: "#000"}},
    FEATURES: {
      DARK_MODE: true,
    },
  }
  it("Configuration : test custom color palettes light mode", async () => {
    await testColor(defaultColorConfig, false, "#fff")
  })
  it("Configuration : test custom color palettes dark mode", async () => {
    await testColor(defaultColorConfig, true, "#000")
  })
  it("Configuration : test custom color palettes dark mode without custom config", async () => {
    await testColor(
      {
        THEME_COLORS: {primary: {main: "#fff"}, secondary: {main: "#fff"}},
        FEATURES: {
          DARK_MODE: true,
        },
      },
      true,
      "#fff"
    )
  })
  it("Configuration : test color mode from cookie", async () => {
    const cookies = new Cookies()
    cookies.set("sidreColorMode", "dark")
    await testColor(defaultColorConfig, false, "#000")
    act(() => cookies.remove("sidreColorMode"))
  })
  it("Configuration : test toggle from dark mode", async () => {
    await testColor(defaultColorConfig, true, "#fff", true)
  })
  it("Configuration : test toggle from light mode", async () => {
    await testColor(defaultColorConfig, false, "#000", true)
  })
  it("Configuration : no dark mode, if feature deactivated", async () => {
    await testColor(
      {
        THEME_COLORS: {primary: {main: "#fff"}, secondary: {main: "#fff"}},
        THEME_COLORS_DARK: {primary: {main: "#000"}, secondary: {main: "#000"}},
        FEATURES: {
          DARK_MODE: false,
        },
      },
      true,
      "#fff"
    )
  })

  it("Configuration : should render without crashing for undefined elasticsearch", async () => {
    window["runTimeConfig"].ELASTIC_SEARCH_INDEX_NAME = null
    await i18n.changeLanguage("en")
    render(
      <I18nextProvider i18n={i18n}>
        <SearchIndexFrontendConfigContext.Provider value={window["runTimeConfig"]}>
          <Configuration>
            <div>test</div>
          </Configuration>
        </SearchIndexFrontendConfigContext.Provider>
      </I18nextProvider>
    )
  })

  it("Configuration : change font size", async () => {
    window["runTimeConfig"] = {
      ...defaultConfig,
      GENERAL_CONFIGURATION: {search: getDefaultSearchConfiguration()},
    }
    render(
      <I18nextProvider i18n={i18n}>
        <SearchIndexFrontendConfigContext.Provider value={window["runTimeConfig"]}>
          <Configuration>
            <ColorTest />
          </Configuration>
        </SearchIndexFrontendConfigContext.Provider>
      </I18nextProvider>
    )
    await userEvent.click(screen.getByRole("button", {name: "fontsize"}))
    const primaryColor = screen.getByLabelText("primary")
    expect(primaryColor).toHaveStyle("font-size: 18px;")
  })
})
