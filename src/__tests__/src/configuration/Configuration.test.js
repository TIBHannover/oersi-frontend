import React, {Suspense} from "react"
import ReactDOM from "react-dom"
import {act} from "react-dom/test-utils"
import Configuration from "../../../components/configuration/Configuration"
import config from "react-global-configuration"
import prod from "../../../config/prod"
import {I18nextProvider} from "react-i18next"
import i18n from "../../../i18n"
import {ConfigurationRunTime} from "../../../helpers/use-context"
window["runTimeConfig"] = {
  ELASTIC_SEARCH: {
    URL: "http://1tes.com",
    CREDENCIAL: "Basic s223H6DS=DSShdjsd6dsDS6",
    APP_NAME: "test_data",
  },
  GENERAL_CONFIGURATION: {
    LANGUAGE: "en",
  },
}

let container = null
beforeAll(() => {
  config.set(prod)
})
beforeEach(() => {
  // setup a DOM element as a render target and configuration for reactiveSearch
  container = document.createElement("div")
  document.body.appendChild(container)
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
})

describe("Configuration ==> Test UI  ", () => {
  it("Configuration : should render without crashing", async () => {
    await act(async () => {
      ReactDOM.render(
        <I18nextProvider i18n={i18n}>
          <Suspense fallback={<div>Loading translations...</div>}>
            <ConfigurationRunTime.Provider value={window["runTimeConfig"]}>
              <Configuration />
            </ConfigurationRunTime.Provider>
          </Suspense>
        </I18nextProvider>,
        container
      )
    })
    ReactDOM.unmountComponentAtNode(container)
  })

  it("Configuration : should render without crashing for germant translation", async () => {
    window["runTimeConfig"].GENERAL_CONFIGURATION.LANGUAGE = "de"
    await act(async () => {
      ReactDOM.render(
        <I18nextProvider i18n={i18n}>
          <Suspense fallback={<div>Loading translations...</div>}>
            <ConfigurationRunTime.Provider value={window["runTimeConfig"]}>
              <Configuration />
            </ConfigurationRunTime.Provider>
          </Suspense>
        </I18nextProvider>,
        container
      )
    })
    ReactDOM.unmountComponentAtNode(container)
  })
})
