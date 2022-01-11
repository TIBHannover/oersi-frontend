import React from "react"
import Configuration from "../Configuration"
import config from "react-global-configuration"
import prod from "../config/prod"
import {I18nextProvider} from "react-i18next"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import {OersiConfigContext} from "../helpers/use-context"
import {render} from "@testing-library/react"

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
}))

window["runTimeConfig"] = {
  ELASTIC_SEARCH: {
    URL: "http://1tes.com",
    CREDENTIALS: "Basic s223H6DS=DSShdjsd6dsDS6",
    APP_NAME: "test_data",
  },
  GENERAL_CONFIGURATION: {},
}

beforeAll(() => {
  config.set(prod)
})
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
    render(
      <I18nextProvider i18n={i18n}>
        <OersiConfigContext.Provider value={window["runTimeConfig"]}>
          <Configuration>
            <div>test</div>
          </Configuration>
        </OersiConfigContext.Provider>
      </I18nextProvider>
    )
  })

  it("Configuration : should render without crashing for German translation", async () => {
    await i18n.changeLanguage("de")
    render(
      <I18nextProvider i18n={i18n}>
        <OersiConfigContext.Provider value={window["runTimeConfig"]}>
          <Configuration>
            <div>test</div>
          </Configuration>
        </OersiConfigContext.Provider>
      </I18nextProvider>
    )
  })

  it("Configuration : should render without crashing for undefined elasticsearch", async () => {
    window["runTimeConfig"].ELASTIC_SEARCH = null
    await i18n.changeLanguage("en")
    render(
      <I18nextProvider i18n={i18n}>
        <OersiConfigContext.Provider value={window["runTimeConfig"]}>
          <Configuration>
            <div>test</div>
          </Configuration>
        </OersiConfigContext.Provider>
      </I18nextProvider>
    )
  })
})
