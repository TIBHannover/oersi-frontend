import React, {Suspense} from "react"
import ReactDOM from "react-dom"
import {act} from "react-dom/test-utils"
import {OersiConfigContext} from "../../helpers/use-context"
import config from "react-global-configuration"
import {shallow} from "../../setupTests"
import prod from "../../config/prod"
import {Search, ToggleFilterButton} from "../../views/Search"

jest.mock("@appbaseio/reactivesearch")
jest.mock("../../components/Header", () => () => <div className="header"></div>)
jest.mock("../../components/SearchResultList", () => () => (
  <div className="result"></div>
))
jest.mock("../../components/Filters", () => () => <div className="filters"></div>)
jest.mock("../../components/SelectedFilters", () => () => (
  <div className="selected-filters"></div>
))

function translateDummy(key, options) {
  return key + "_translated"
}
const defaultConfig = {
  PUBLIC_URL: "https://some.url",
  FEATURES: {},
}
beforeEach(() => {
  // setup a config file
  config.set(prod, {freeze: false})
})

describe("Search ==> Test UI", () => {
  it("Search : should render without crashing", async () => {
    const div = document.createElement("div")
    await act(async () => {
      ReactDOM.render(
        <OersiConfigContext.Provider value={defaultConfig}>
          <Search multilist={config.get("multiList")} t={translateDummy} />
        </OersiConfigContext.Provider>,
        div
      )
    })
    ReactDOM.unmountComponentAtNode(div)
  })

  it("Search : should render without crashing in mobile view", async () => {
    const div = document.createElement("div")
    await act(async () => {
      ReactDOM.render(
        <OersiConfigContext.Provider value={defaultConfig}>
          <Search
            isMobile={true}
            multilist={config.get("multiList")}
            t={translateDummy}
          />
        </OersiConfigContext.Provider>,
        div
      )
    })
    ReactDOM.unmountComponentAtNode(div)
  })

  it("Search : should render toggle filter button", () => {
    const div = document.createElement("div")
    ReactDOM.render(
      <ToggleFilterButton
        showFilter={true}
        onToggleShowFilterButton={() => true}
        t={translateDummy}
      />,
      div
    )
    const labelNodes = div.querySelectorAll(".MuiButton-label")
    const labels = Array.from(labelNodes.values()).map((e) => e.textContent)
    expect(labels).toContain("FILTER.HIDE_FILTER_translated")
    ReactDOM.unmountComponentAtNode(div)
  })
  it("Search : should render toggle filter button, hidden filters", () => {
    const div = document.createElement("div")
    ReactDOM.render(
      <ToggleFilterButton
        showFilter={false}
        onToggleShowFilterButton={() => true}
        t={translateDummy}
      />,
      div
    )
    const labelNodes = div.querySelectorAll(".MuiButton-label")
    const labels = Array.from(labelNodes.values()).map((e) => e.textContent)
    expect(labels).toContain("FILTER.SHOW_FILTER_translated")
    ReactDOM.unmountComponentAtNode(div)
  })
  it("Test click on toggle filter button", () => {
    const mockCallBack = jest.fn()
    const toggleButton = shallow(
      <ToggleFilterButton
        showFilter={false}
        onToggleShowFilterButton={mockCallBack}
        t={translateDummy}
      />
    )
    toggleButton.find(".toggle-filter-button").simulate("click")
    expect(mockCallBack.mock.calls.length).toEqual(1)
  })

  it("Search : should render with hidden filter", () => {
    const div = document.createElement("div")
    ReactDOM.render(
      <OersiConfigContext.Provider value={defaultConfig}>
        <Search
          showFilter={false}
          multilist={config.get("multiList")}
          t={translateDummy}
        />
      </OersiConfigContext.Provider>,
      div
    )
    ReactDOM.unmountComponentAtNode(div)
  })
})
