import React from "react"
import {Provider} from "react-redux"
import ReactDOM from "react-dom"
import {act} from "react-dom/test-utils"
import MenuComponent from "../../../components/menuComponent/MenuComponent"
import {I18nextProvider} from "react-i18next"
import i18n from "i18next"
import i18next from "i18next"
import {initReactI18next} from "react-i18next"
import configureStore from "redux-mock-store"
import {ConfigurationRunTime} from "../../../helpers/use-context"

const fakeTranslatedEN = {
  HEADER: {
    CHANGE_LANGUAGE_GERMAN: "German",
    CHANGE_LANGUAGE_ENGLISH: "English",
  },
}
const fakeTranslatedDE = {
  HEADER: {
    CHANGE_LANGUAGE_GERMAN: "Deutsch",
    CHANGE_LANGUAGE_ENGLISH: "Englisch",
  },
}
const mockStore = configureStore([])
const store = mockStore({})

i18next.use(initReactI18next).init({
  lng: "en",
  fallbackLng: ["en", "de", "sq", "fr"],

  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",

  debug: true,

  interpolation: {
    escapeValue: false, // not needed for react!!
  },

  resources: {
    en: {translations: fakeTranslatedEN},
    de: {translations: fakeTranslatedDE},
  },
})
let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div")
  document.body.appendChild(container)
})

describe("MenuComponent ==> Test UI  ", () => {
  it("MenuComponent : should render without crashing and render HTML ", async () => {
    await act(async () => {
      ReactDOM.render(<MenuComponent />, container)
    })

    ReactDOM.unmountComponentAtNode(container)
  })

  it("MenuComponent : should render without crashing without render HTML", async () => {
    await act(async () => {
      ReactDOM.render(
        <Provider store={store}>
          <I18nextProvider i18n={i18next}>
            {/* <ConfigurationRunTime.Provider value={}> */}
            <MenuComponent />
            {/* </ConfigurationRunTime.Provider> */}
          </I18nextProvider>
        </Provider>,
        container
      )
    })
    const labelNodes = container.querySelector(".menu-language-div>h6")
    console.log(labelNodes.textContent)
    expect(labelNodes.textContent).toMatch(
      fakeTranslatedEN.HEADER.CHANGE_LANGUAGE_ENGLISH
    )
    ReactDOM.unmountComponentAtNode(container)
  })

  it("MenuComponent : should render without crashing without render HTML", async () => {
    i18next.changeLanguage("de")
    await act(async () => {
      ReactDOM.render(
        <Provider store={store}>
          <I18nextProvider i18n={i18next}>
            {/* <ConfigurationRunTime.Provider value={} 
            >*/}
            <MenuComponent />
            {/* </ConfigurationRunTime.Provider> */}
          </I18nextProvider>
        </Provider>,
        container
      )
    })
    const labelNodes = container.querySelector(".menu-language-div>h6")
    console.log(labelNodes.textContent)
    expect(labelNodes.textContent).toMatch(
      fakeTranslatedDE.HEADER.CHANGE_LANGUAGE_GERMAN
    )
    ReactDOM.unmountComponentAtNode(container)
  })
})
