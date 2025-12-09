import React from "react"
import SearchField from "../../components/SearchField"
import {render, screen} from "@testing-library/react"
import {getDefaultSearchConfiguration} from "../helpers/test-helpers"
import {SearchIndexFrontendConfigContext} from "../../helpers/use-context"
import userEvent from "@testing-library/user-event"
import {MemoryRouter} from "react-router"

const mockRefine = jest.fn()
jest.mock("react-instantsearch", () => ({
  useSearchBox: () => {
    return {query: "abc", refine: mockRefine}
  },
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
const routes = {
  CONTACT: "/services/contact",
  DETAILS_BASE: "/",
  HOME_PAGE: "/home",
  SEARCH: "/",
}

describe("SearchField ==> Test UI  ", () => {
  it("SearchField : should render correctly", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <SearchIndexFrontendConfigContext.Provider
          value={{
            searchConfiguration: getDefaultSearchConfiguration(),
            routes: routes,
          }}
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
            routes: routes,
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
            routes: routes,
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

  it("navigate to search for non-searchview", async () => {
    render(
      <MemoryRouter initialEntries={["/some/page"]}>
        <SearchIndexFrontendConfigContext.Provider
          value={{
            searchConfiguration: getDefaultSearchConfiguration(),
            routes: routes,
          }}
        >
          <SearchField />
        </SearchIndexFrontendConfigContext.Provider>
      </MemoryRouter>
    )
    const searchbox = screen.getByRole("searchbox", {
      name: "",
    })
    expect(searchbox).toBeInTheDocument()
    await userEvent.type(searchbox, "searchterm")
    expect(mockRefine).toBeCalled()
    expect(mockNavigate).toBeCalled()
  })

  it("no navigate for searchview", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <SearchIndexFrontendConfigContext.Provider
          value={{
            searchConfiguration: getDefaultSearchConfiguration(),
            routes: routes,
          }}
        >
          <SearchField />
        </SearchIndexFrontendConfigContext.Provider>
      </MemoryRouter>
    )
    const searchbox = screen.getByRole("searchbox", {
      name: "",
    })
    expect(searchbox).toBeInTheDocument()
    await userEvent.type(searchbox, "searchterm")
    expect(mockRefine).toBeCalled()
    expect(mockNavigate).not.toBeCalled()
  })
})
