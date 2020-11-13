import React from "react"
import ReactDOM from "react-dom"
import {act} from "react-dom/test-utils"
import ErrorComponent from "../../../components/errorComponent/ErrorComponent"
import {Provider} from "react-redux"
import {I18nextProvider} from "react-i18next"
import configureStore from "redux-mock-store"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"

const mockStore = configureStore([])
const store = mockStore({})
let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  i18n.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react!!
    },

    resources: {
      en: {translations: require("../../../../public/locales/en/translation.json")},
    },
  })
  container = document.createElement("div")
  document.body.appendChild(container)
})

describe("ErrorComponent ==> Test UI  ", () => {
  it("ErrorComponent : should render without crashing", async () => {
    await act(async () => {
      ReactDOM.render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <ErrorComponent />
          </I18nextProvider>
        </Provider>,
        container
      )
    })
    ReactDOM.unmountComponentAtNode(container)
  })
})
