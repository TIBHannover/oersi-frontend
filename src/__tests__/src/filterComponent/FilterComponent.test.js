import React, {Suspense} from "react"
import ReactDOM from "react-dom"
import {act} from "react-dom/test-utils"
import config from "react-global-configuration"
import prod from "../../../config/prod"
import FilterComponent from "../../../components/filterComponent/FilterComponent"
import {I18nextProvider} from "react-i18next"
import i18n from "i18next"

beforeEach(() => {
  // setup a config file
  config.set(prod, {freeze: false})
})

describe("FilterComponent ==> Test UI  ", () => {
  it("FilterComponent : should render without crashing", async () => {
    const div = document.createElement("div")
    await act(async () => {
      ReactDOM.render(
        <I18nextProvider i18n={i18n}>
          <Suspense fallback={<div>Loading translations...</div>}>
            <FilterComponent multilist={config.get("multiList")} />
          </Suspense>
        </I18nextProvider>,
        div
      )
    })
    ReactDOM.unmountComponentAtNode(div)
  })
})
