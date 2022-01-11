import React from "react"
import {OersiConfigContext} from "../../helpers/use-context"
import config from "react-global-configuration"
import prod from "../../config/prod"
import Search, {ToggleFilterButton} from "../../views/Search"
import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {ThemeProvider} from "@mui/material"
import {getTheme} from "../../Configuration"

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
        <ThemeProvider theme={getTheme()}>
          <Search multilist={config.get("multiList")} />
        </ThemeProvider>
      </OersiConfigContext.Provider>
    )
    expect(
      screen.queryByRole("heading", {name: "RESULT_LIST.SHOW_RESULT_STATS"})
    ).toBeInTheDocument()
  })

  it("Search : should render without crashing in mobile view", async () => {
    render(
      <OersiConfigContext.Provider value={defaultConfig}>
        <ThemeProvider theme={getTheme()}>
          <Search isMobile={true} multilist={config.get("multiList")} />
        </ThemeProvider>
      </OersiConfigContext.Provider>
    )
    expect(
      screen.queryByRole("heading", {name: "RESULT_LIST.SHOW_RESULT_STATS"})
    ).toBeInTheDocument()
  })

  it("Search : should render toggle filter button", () => {
    render(
      <ThemeProvider theme={getTheme()}>
        <ToggleFilterButton
          showFilter={true}
          onToggleShowFilterButton={() => true}
        />
      </ThemeProvider>
    )
    expect(
      screen.queryByRole("button", {name: "toggle filters"})
    ).toBeInTheDocument()
  })
  it("Search : should render toggle filter button, hidden filters", () => {
    render(
      <ThemeProvider theme={getTheme()}>
        <ToggleFilterButton
          showFilter={false}
          onToggleShowFilterButton={() => true}
        />
      </ThemeProvider>
    )
    expect(
      screen.queryByRole("button", {name: "toggle filters"})
    ).toBeInTheDocument()
  })
  it("Test click on toggle filter button", () => {
    const mockCallBack = jest.fn()
    render(
      <ThemeProvider theme={getTheme()}>
        <ToggleFilterButton
          showFilter={false}
          onToggleShowFilterButton={mockCallBack}
        />
      </ThemeProvider>
    )
    const toggleButton = screen.getByRole("button", {name: "toggle filters"})
    userEvent.click(toggleButton)
    expect(mockCallBack).toHaveBeenCalled()
  })

  it("Search : should render with hidden filter", () => {
    render(
      <OersiConfigContext.Provider value={defaultConfig}>
        <ThemeProvider theme={getTheme()}>
          <Search showFilter={false} multilist={config.get("multiList")} />
        </ThemeProvider>
      </OersiConfigContext.Provider>
    )
    expect(
      screen.queryByRole("heading", {name: "RESULT_LIST.SHOW_RESULT_STATS"})
    ).toBeInTheDocument()
  })
})
