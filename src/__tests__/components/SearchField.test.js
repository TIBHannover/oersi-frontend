import React from "react"
import SearchField from "../../components/SearchField"
import {render, screen} from "@testing-library/react"
import {getDefaultSearchConfiguration} from "../helpers/test-helpers"
import {SearchIndexFrontendConfigContext} from "../../helpers/use-context"
import userEvent from "@testing-library/user-event"
import {MemoryRouter} from "react-router"

jest.mock("@appbaseio/reactivesearch", () => ({
  DataSearch: () => <div />,
}))
const mockNavigate = jest.fn()
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
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

describe("SearchField ==> Test UI  ", () => {
  it("SearchField : should render correctly", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <SearchIndexFrontendConfigContext.Provider
          value={{searchConfiguration: getDefaultSearchConfiguration()}}
        >
          <SearchField />
        </SearchIndexFrontendConfigContext.Provider>
      </MemoryRouter>
    )
  })

  it("show open filter button", async () => {
    const mock = jest.fn()
    render(
      <MemoryRouter initialEntries={["/"]}>
        <SearchIndexFrontendConfigContext.Provider
          value={{
            searchConfiguration: getDefaultSearchConfiguration(),
            onToggleFilterViewOpen: mock,
          }}
        >
          <SearchField />
        </SearchIndexFrontendConfigContext.Provider>
      </MemoryRouter>
    )
    const filterButton = screen.getByRole("button", {
      name: "open filter drawer",
    })
    await userEvent.click(filterButton)
    expect(mock).toBeCalled()
  })

  it("no open filter button for non-searchview", async () => {
    render(
      <MemoryRouter initialEntries={["/some/page"]}>
        <SearchIndexFrontendConfigContext.Provider
          value={{
            searchConfiguration: getDefaultSearchConfiguration(),
          }}
        >
          <SearchField />
        </SearchIndexFrontendConfigContext.Provider>
      </MemoryRouter>
    )
    expect(
      screen.queryByRole("button", {name: "open filter drawer"})
    ).not.toBeInTheDocument()
  })
})
