import React from "react"
import {render, screen} from "@testing-library/react"
import Filters from "../../components/Filters"
import {SearchIndexFrontendConfigContext} from "../../helpers/use-context"
import userEvent from "@testing-library/user-event"
import {getDefaultSearchConfiguration} from "../helpers/test-helpers"

jest.mock("../../components/MultiSelectionFilter", () => () => (
  <div className="multiList" />
))
jest.mock("../../components/SwitchFilter", () => () => (
  <div className="switchList" />
))
jest.mock("react-instantsearch", () => ({
  useStats: () => {
    return {nbHits: 100}
  },
  useInstantSearch: () => {
    return {status: "ok"}
  },
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

const defaultConfig = {
  searchConfiguration: getDefaultSearchConfiguration(),
  isFilterViewOpen: true,
}

describe("Filters ==> Test UI", () => {
  it("Filters : should render with open filter view", () => {
    const {container} = render(
      <SearchIndexFrontendConfigContext.Provider value={defaultConfig}>
        <Filters />
      </SearchIndexFrontendConfigContext.Provider>
    )
    const filterElements = Array.from(container.querySelectorAll(".multiList"))
    expect(filterElements).toHaveLength(7)
  })

  it("Filters : should render with closed filter view", () => {
    const {container} = render(
      <SearchIndexFrontendConfigContext.Provider
        value={{...defaultConfig, isFilterViewOpen: false}}
      >
        <Filters />
      </SearchIndexFrontendConfigContext.Provider>
    )
    const filterElements = Array.from(container.querySelectorAll(".multiList"))
    expect(filterElements).toHaveLength(7)
  })

  it("Filters : should close view", async () => {
    const mock = jest.fn()
    render(
      <SearchIndexFrontendConfigContext.Provider
        value={{
          ...defaultConfig,
          isFilterViewOpen: true,
          onCloseFilterView: mock,
        }}
      >
        <Filters />
      </SearchIndexFrontendConfigContext.Provider>
    )
    const closeButton = screen.getByRole("button", {name: "FILTER.SHOW_RESULTS"})
    await userEvent.click(closeButton)
    expect(mock).toBeCalled()
  })
})
