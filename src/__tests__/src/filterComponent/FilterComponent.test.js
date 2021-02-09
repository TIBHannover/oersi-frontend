import React, {Suspense} from "react"
import ReactDOM from "react-dom"
import {act} from "react-dom/test-utils"
import config from "react-global-configuration"
import prod from "../../../config/prod"
import FilterComponent from "../../../components/filterComponent/FilterComponent"
import {renderSelectedFilters} from "../../../components/filterComponent/FilterComponent"
import {I18nextProvider} from "react-i18next"
import i18n from "i18next"

beforeEach(() => {
  // setup a config file
  config.set(prod, {freeze: false})
})

function translateDummy(key, options) {
  return key + "_translated"
}

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

  it("SelectedFilters : should render for no selected filter", () => {
    const data = {
      selectedValues: [],
    }
    let result = renderSelectedFilters(data, translateDummy)
    const div = document.createElement("div")
    ReactDOM.render(result, div)
    expect(div.querySelector("button")).toBeNull()
  })

  it("SelectedFilters : should render selected filters", () => {
    const data = {
      selectedValues: {
        filter1: {
          showFilter: true,
          label: "filter1",
          value: "value1",
        },
        filter2: {
          showFilter: true,
          label: "filter2",
          value: ["value1", "value2"],
        },
        filter3: {
          showFilter: false,
          label: "filter3",
          value: "value3",
        },
        unused1: {
          showFilter: true,
          label: "filter4",
          value: "value4",
        },
        invalid1: {
          showFilter: true,
          value: "value4",
        },
        invalid2: {
          showFilter: true,
          label: "filter4",
        },
      },
      components: ["filter1", "filter2", "filter3", "invalid1", "invalid2"],
    }
    let result = renderSelectedFilters(data, translateDummy)
    const div = document.createElement("div")
    ReactDOM.render(result, div)
    const buttonLabelNodes = div.querySelectorAll("button .MuiButton-label")
    expect(buttonLabelNodes).not.toBeNull()
    const buttonLabels = Array.from(buttonLabelNodes.values()).map(
      (e) => e.textContent
    )
    expect(buttonLabels).toContain("LABEL.filter1_translated: value1")
    expect(buttonLabels).toContain("LABEL.filter2_translated: value1, value2")
    expect(buttonLabels).not.toContain("LABEL.filter3_translated: value3")
    expect(buttonLabels).not.toContain("LABEL.filter4_translated: value4")
    expect(buttonLabels.length).toEqual(3)
  })
})
