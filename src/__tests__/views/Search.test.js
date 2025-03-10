import React from "react"
import searchConfiguration from "../../config/SearchConfiguration"
import {SearchIndexFrontendConfigContext} from "../../helpers/use-context"
import Search from "../../views/Search"
import {render, screen} from "@testing-library/react"
import {ThemeProvider} from "@mui/material"
import {MemoryRouter} from "react-router"
import {getTheme} from "../../Configuration"

jest.mock("@appbaseio/reactivesearch", () => ({
  ReactiveBase: ({children}) => <div data-testid="ReactiveBase">{children}</div>,
  DataSearch: () => <div />,
  MultiList: () => <div />,
  ReactiveList: () => <div />,
  SelectedFilters: () => <div />,
  SingleDataList: () => <div />,
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
  searchConfiguration: searchConfiguration,
}

describe("Search ==> Test UI", () => {
  it("Search : should render without crashing", async () => {
    render(
      <MemoryRouter>
        <SearchIndexFrontendConfigContext.Provider value={defaultConfig}>
          <ThemeProvider theme={getTheme()}>
            <Search />
          </ThemeProvider>
        </SearchIndexFrontendConfigContext.Provider>
      </MemoryRouter>
    )
    expect(screen.queryByLabelText("results", {})).toBeInTheDocument()
  })

  it("Search : should render with hidden filter", () => {
    render(
      <MemoryRouter>
        <SearchIndexFrontendConfigContext.Provider value={defaultConfig}>
          <ThemeProvider theme={getTheme()}>
            <Search isFilterViewOpen={false} />
          </ThemeProvider>
        </SearchIndexFrontendConfigContext.Provider>
      </MemoryRouter>
    )
    expect(screen.queryByLabelText("results", {})).toBeInTheDocument()
  })
})
