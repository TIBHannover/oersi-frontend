import React from "react"
import {OersiConfigContext} from "../../helpers/use-context"
import config from "react-global-configuration"
import prod from "../../config/prod"
import Search, {ToggleFilterButton} from "../../views/Search"
import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"

jest.mock("@appbaseio/reactivesearch")
jest.mock("../../components/Header", () => () => <div className="header"></div>)
jest.mock("../../components/SearchResultList", () => () => (
  <div className="result"></div>
))
jest.mock("../../components/Filters", () => () => <div className="filters"></div>)
jest.mock("../../components/SelectedFilters", () => () => (
  <div className="selected-filters"></div>
))

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
  PUBLIC_URL: "https://some.url",
  FEATURES: {},
}
beforeEach(() => {
  // setup a config file
  config.set(prod, {freeze: false})
})

describe("Search ==> Test UI", () => {
  it("Search : should render without crashing", async () => {
    render(
      <OersiConfigContext.Provider value={defaultConfig}>
        <Search multilist={config.get("multiList")} />
      </OersiConfigContext.Provider>
    )
    expect(
      screen.queryByRole("heading", {name: "RESULT_LIST.SHOW_RESULT_STATS"})
    ).toBeInTheDocument()
  })

  it("Search : should render without crashing in mobile view", async () => {
    render(
      <OersiConfigContext.Provider value={defaultConfig}>
        <Search isMobile={true} multilist={config.get("multiList")} />
      </OersiConfigContext.Provider>
    )
    expect(
      screen.queryByRole("heading", {name: "RESULT_LIST.SHOW_RESULT_STATS"})
    ).toBeInTheDocument()
  })

  it("Search : should render toggle filter button", () => {
    render(
      <ToggleFilterButton showFilter={true} onToggleShowFilterButton={() => true} />
    )
    expect(
      screen.queryByRole("button", {name: "toggle filters"})
    ).toBeInTheDocument()
  })
  it("Search : should render toggle filter button, hidden filters", () => {
    render(
      <ToggleFilterButton showFilter={false} onToggleShowFilterButton={() => true} />
    )
    expect(
      screen.queryByRole("button", {name: "toggle filters"})
    ).toBeInTheDocument()
  })
  it("Test click on toggle filter button", () => {
    const mockCallBack = jest.fn()
    render(
      <ToggleFilterButton
        showFilter={false}
        onToggleShowFilterButton={mockCallBack}
      />
    )
    const toggleButton = screen.getByRole("button", {name: "toggle filters"})
    userEvent.click(toggleButton)
    expect(mockCallBack).toHaveBeenCalled()
  })

  it("Search : should render with hidden filter", () => {
    render(
      <OersiConfigContext.Provider value={defaultConfig}>
        <Search showFilter={false} multilist={config.get("multiList")} />
      </OersiConfigContext.Provider>
    )
    expect(
      screen.queryByRole("heading", {name: "RESULT_LIST.SHOW_RESULT_STATS"})
    ).toBeInTheDocument()
  })
})
