import React from "react"
import SelectedFilters, {
  renderSelectedFilters,
} from "../../components/SelectedFilters"
import {render, screen} from "@testing-library/react"

jest.mock("@appbaseio/reactivesearch", () => ({
  SelectedFilters: () => <div />,
}))
jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }
  },
}))

describe("Filters ==> Test UI  ", () => {
  it("SelectedFilters : should render", () => {
    render(<SelectedFilters />)
  })

  it("SelectedFilters : should render for no selected filter", () => {
    const data = {
      selectedValues: [],
    }
    let result = renderSelectedFilters(data, {t: (s) => s}, false)
    render(result)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
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
    let result = renderSelectedFilters(data, {t: (s) => s}, false)
    render(result)
    const buttons = screen.getAllByRole("button")
    expect(buttons).not.toBeNull()
    const buttonLabels = Array.from(buttons.values()).map((e) => e.textContent)
    expect(buttonLabels).toContain("data:fieldLabels.filter1: value1")
    expect(buttonLabels).toContain("data:fieldLabels.filter2: value1, value2")
    expect(buttonLabels).not.toContain("data:fieldLabels.filter3: value3")
    expect(buttonLabels).not.toContain("data:fieldLabels.filter4: value4")
    expect(buttonLabels.length).toEqual(3)
  })
})
