import React from "react"
import {Provider} from "react-redux"
import ReactDOM from "react-dom"
import {act} from "react-dom/test-utils"
import ChangeLanguageComponent from "../../../components/changeLanguageComponent/MenuComponent"
import {I18nextProvider} from "react-i18next"
import i18n from "i18next"
import i18next from "i18next"
import {initReactI18next} from "react-i18next"
import configureStore from "redux-mock-store"
import history from "../../../helpers/history"
import {Router} from "react-router-dom"
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
      ReactDOM.render(<ChangeLanguageComponent />, container)
    })

    ReactDOM.unmountComponentAtNode(container)
  })

  it("MenuComponent : should have English language by default", async () => {
    await act(async () => {
      ReactDOM.render(
        <Router history={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18next}>
              {/* <ConfigurationRunTime.Provider value={}> */}
              <ChangeLanguageComponent />
              {/* </ConfigurationRunTime.Provider> */}
            </I18nextProvider>
          </Provider>
        </Router>,
        container
      )
    })
    const labelNodes = container.querySelector(
      ".menu-language-div  .dropdown>button"
    )
    console.log(labelNodes.innerHTML)
    expect(labelNodes.textContent).toMatch(
      fakeTranslatedEN.HEADER.CHANGE_LANGUAGE_ENGLISH
    )
    ReactDOM.unmountComponentAtNode(container)
  })

  it("MenuComponent : should have change to German language", async () => {
    i18next.changeLanguage("de")
    await act(async () => {
      ReactDOM.render(
        <Router history={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18next}>
              {/* <ConfigurationRunTime.Provider value={}> */}
              <ChangeLanguageComponent />
              {/* </ConfigurationRunTime.Provider> */}
            </I18nextProvider>
          </Provider>
        </Router>,
        container
      )
    })
    const labelNodes = container.querySelector(
      ".menu-language-div  .dropdown>button"
    )
    expect(labelNodes.textContent).toMatch(
      fakeTranslatedDE.HEADER.CHANGE_LANGUAGE_GERMAN
    )
    ReactDOM.unmountComponentAtNode(container)
  })

  it("MenuComponent : should be disabled button for German language because this language is active", async () => {
    i18next.changeLanguage("de")
    await act(async () => {
      ReactDOM.render(
        <Router history={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18next}>
              {/* <ConfigurationRunTime.Provider value={}> */}
              <ChangeLanguageComponent />
              {/* </ConfigurationRunTime.Provider> */}
            </I18nextProvider>
          </Provider>
        </Router>,
        container
      )
    })
    //get all button
    const buttons = container.querySelectorAll(
      ".menu-language-div  .dropdown .dropdown-menu>button"
    )
    // language must change to English
    expect(buttons[1].disabled).toBeTruthy()
    ReactDOM.unmountComponentAtNode(container)
  })

  it("MenuComponent : should change language in English by Click event", async () => {
    i18next.changeLanguage("de")
    await act(async () => {
      ReactDOM.render(
        <Router history={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18next}>
              {/* <ConfigurationRunTime.Provider value={}> */}
              <ChangeLanguageComponent />
              {/* </ConfigurationRunTime.Provider> */}
            </I18nextProvider>
          </Provider>
        </Router>,
        container
      )
    })
    //get all button
    const buttons = container.querySelectorAll(
      ".menu-language-div  .dropdown .dropdown-menu>button"
    )
    //simulate click
    buttons[0].click()
    // check if language has change
    const labelNodes = container.querySelector(
      ".menu-language-div  .dropdown>button"
    )

    // language must change to English
    expect(labelNodes.innerHTML).toMatch(
      fakeTranslatedEN.HEADER.CHANGE_LANGUAGE_ENGLISH
    )
    ReactDOM.unmountComponentAtNode(container)
  })

  it("MenuComponent : should change language in German by Click event", async () => {
    i18next.changeLanguage("en")
    await act(async () => {
      ReactDOM.render(
        <Router history={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18next}>
              {/* <ConfigurationRunTime.Provider value={}> */}
              <ChangeLanguageComponent />
              {/* </ConfigurationRunTime.Provider> */}
            </I18nextProvider>
          </Provider>
        </Router>,
        container
      )
    })
    //get all button
    const buttons = container.querySelectorAll(
      ".menu-language-div  .dropdown .dropdown-menu>button"
    )
    //simulate click
    buttons[1].click()
    // check if language has change
    const labelNodes = container.querySelector(
      ".menu-language-div  .dropdown>button"
    )

    // language must change to English
    expect(labelNodes.innerHTML).toMatch(
      fakeTranslatedDE.HEADER.CHANGE_LANGUAGE_GERMAN
    )
    ReactDOM.unmountComponentAtNode(container)
  })
})
