import React from "react"
import {OersiConfigContext} from "../../helpers/use-context"
import config from "react-global-configuration"
import prod from "../../config/prod"
import Search from "../../views/Search"
import {render, screen} from "@testing-library/react"
import {ThemeProvider} from "@mui/material"
import {getTheme} from "../../Configuration"

jest.mock("@appbaseio/reactivesearch", () => ({
  ReactiveBase: ({children}) => <div data-testid="ReactiveBase">{children}</div>,
  DataSearch: () => <div />,
  MultiList: () => <div />,
  ReactiveList: () => <div />,
  SelectedFilters: () => <div />,
  StateProvider: () => <div />,
}))
jest.mock("../../components/Header", () => () => <div className="header" />)
jest.mock("../../components/SearchResultList", () => () => (
  <div className="result" />
))
jest.mock("../../components/Filters", () => () => <div className="filters" />)
jest.mock("../../components/SelectedFilters", () => () => (
  <div className="selected-filters" />
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
          <Search />
        </ThemeProvider>
      </OersiConfigContext.Provider>
    )
    expect(screen.queryByLabelText("results", {})).toBeInTheDocument()
  })

  it("Search : should render without crashing in mobile view", async () => {
    render(
      <OersiConfigContext.Provider value={defaultConfig}>
        <ThemeProvider theme={getTheme()}>
          <Search isMobile={true} />
        </ThemeProvider>
      </OersiConfigContext.Provider>
    )
    expect(screen.queryByLabelText("results", {})).toBeInTheDocument()
  })

  it("Search : should render with hidden filter", () => {
    render(
      <OersiConfigContext.Provider value={defaultConfig}>
        <ThemeProvider theme={getTheme()}>
          <Search isFilterViewOpen={false} />
        </ThemeProvider>
      </OersiConfigContext.Provider>
    )
    expect(screen.queryByLabelText("results", {})).toBeInTheDocument()
  })
})
