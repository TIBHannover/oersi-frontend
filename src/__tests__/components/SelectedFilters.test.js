import React from "react"
import SelectedFilters from "../../components/SelectedFilters"
import {render, screen} from "@testing-library/react"
import {SearchIndexFrontendConfigContext} from "../../helpers/use-context"
import {getDefaultSearchConfiguration} from "../helpers/test-helpers"

const mockCurrentRefinements = jest.fn()
jest.mock("react-instantsearch", () => ({
  useClearRefinements: () => ({
    canRefine: false,
    refine: jest.fn(() => {}),
  }),
  useCurrentRefinements: () => mockCurrentRefinements(),
  useSearchBox: () => ({}),
}))
jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        t: (str) => str,
        changeLanguage: () => new Promise(() => {}),
      },
    }
  },
}))

describe("Filters ==> Test UI  ", () => {
  const mockEmptyRefinements = () => {
    mockCurrentRefinements.mockImplementation(() => ({items: []}))
  }
  it("SelectedFilters : should render", () => {
    mockEmptyRefinements()
    render(
      <SearchIndexFrontendConfigContext.Provider
        value={{
          searchConfiguration: getDefaultSearchConfiguration(),
        }}
      >
        <SelectedFilters />
      </SearchIndexFrontendConfigContext.Provider>
    )
  })

  it("SelectedFilters : should render for no selected filter", () => {
    mockEmptyRefinements()
    render(
      <SearchIndexFrontendConfigContext.Provider
        value={{
          searchConfiguration: getDefaultSearchConfiguration(),
        }}
      >
        <SelectedFilters />
      </SearchIndexFrontendConfigContext.Provider>
    )
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("SelectedFilters : should render selected filters", () => {
    mockCurrentRefinements.mockImplementation(() => ({
      items: [
        {label: "filter1", refinements: [{value: "value1"}]},
        {label: "filter2", refinements: [{value: "value1"}, {value: "value2"}]},
      ],
    }))
    render(
      <SearchIndexFrontendConfigContext.Provider
        value={{
          searchConfiguration: getDefaultSearchConfiguration(),
        }}
      >
        <SelectedFilters />
      </SearchIndexFrontendConfigContext.Provider>
    )
    const buttons = screen.getAllByRole("button")
    expect(buttons).not.toBeNull()
    const buttonLabels = Array.from(buttons.values()).map((e) => e.textContent)
    expect(buttonLabels).toContain("data:fieldLabels.filter1: value1")
    expect(buttonLabels).toContain("data:fieldLabels.filter2: value1, value2")
    expect(buttonLabels.length).toEqual(2)
  })
})
