import React, {Suspense} from "react"
import ReactDOM from "react-dom"
import {act} from "react-dom/test-utils"
import Header from "../../components/Header"
import config from "react-global-configuration"
import prod from "../../config/prod"
import {I18nextProvider} from "react-i18next"
import i18n from "../../i18n"

beforeEach(() => {
  // setup a DOM element as a render target and configuration for reactiveSearch
  config.set(prod)
})

describe("Header ==> Test UI  ", () => {
  it("Header : should render without crashing", async () => {
    const div = document.createElement("div")
    await act(async () => {
      ReactDOM.render(
        <I18nextProvider i18n={i18n}>
          <Suspense fallback={<div>Loading translations...</div>}>
            <Header isMobile={true} />
          </Suspense>
        </I18nextProvider>,
        div
      )
    })
    ReactDOM.unmountComponentAtNode(div)
  })
})
