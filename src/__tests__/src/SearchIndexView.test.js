import React, {Suspense} from "react"
import ReactDOM from "react-dom"
import {act} from "react-dom/test-utils"
import config from "react-global-configuration"
import prod from "../../config/prod"
import {SearchIndexView} from "../../components/SearchIndexView"

jest.mock("@appbaseio/reactivesearch")
jest.mock("../../components/headerComponent/HeaderComponent", () => () => (
  <div className="header"></div>
))
jest.mock("../../components/resultComponent/ResultComponent", () => () => (
  <div className="result"></div>
))
jest.mock("../../components/filtersComponent/FiltersComponent", () => () => (
  <div className="filters"></div>
))
jest.mock("../../components/filtersComponent/SelectedFiltersComponent", () => () => (
  <div className="selected-filters"></div>
))

function translateDummy(key, options) {
  return key + "_translated"
}

beforeEach(() => {
  // setup a config file
  config.set(prod, {freeze: false})
})

describe("SearchIndexView ==> Test UI", () => {
  it("SearchIndexView : should render without crashing", async () => {
    const div = document.createElement("div")
    await act(async () => {
      ReactDOM.render(
        <SearchIndexView multilist={config.get("multiList")} t={translateDummy} />,
        div
      )
    })
    ReactDOM.unmountComponentAtNode(div)
  })

  it("SearchIndexView : should render without crashing in mobile view", async () => {
    const div = document.createElement("div")
    await act(async () => {
      ReactDOM.render(
        <SearchIndexView
          isMobile={true}
          multilist={config.get("multiList")}
          t={translateDummy}
        />,
        div
      )
    })
    ReactDOM.unmountComponentAtNode(div)
  })
})
