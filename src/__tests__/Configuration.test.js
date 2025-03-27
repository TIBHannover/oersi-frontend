import React from "react"
import Configuration from "../Configuration"
import {I18nextProvider} from "react-i18next"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import {getDefaultSearchConfiguration} from "./helpers/test-helpers"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import {act, render, screen} from "@testing-library/react"
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
    const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
    return (
      <>
        <div aria-label="primary" className="text-primary">
          {frontendConfig.isDarkMode ? "DARK" : "LIGHT"}
        </div>
        <button
          aria-label="toggle"
          onClick={() =>
            frontendConfig.onChangeColorMode(
              frontendConfig.isDarkMode ? "light" : "dark"
            )
          }
        />
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
    expectedMode,
    toggle = false
  ) => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: isDarkModePreferred,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
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
    expect(primaryColor).toBeInTheDocument()
    expect(primaryColor).toHaveTextContent(expectedMode)
  }

  const defaultColorConfig = {
    FEATURES: {
      DARK_MODE: true,
    },
  }
  it("Configuration : test custom color palettes light mode", async () => {
    await testColor(defaultColorConfig, false, "LIGHT")
  })
  it("Configuration : test custom color palettes dark mode", async () => {
    await testColor(defaultColorConfig, true, "DARK")
  })
  it("Configuration : test color mode from cookie", async () => {
    const cookies = new Cookies()
    cookies.set("sidreColorMode", "dark")
    await testColor(defaultColorConfig, false, "DARK")
    act(() => cookies.remove("sidreColorMode"))
  })
  it("Configuration : test toggle from dark mode", async () => {
    await testColor(defaultColorConfig, true, "LIGHT", true)
  })
  it("Configuration : test toggle from light mode", async () => {
    await testColor(defaultColorConfig, false, "DARK", true)
  })
  it("Configuration : no dark mode, if feature deactivated", async () => {
    await testColor(
      {
        FEATURES: {
          DARK_MODE: false,
        },
      },
      true,
      "LIGHT"
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
})
