import React from "react"
import {render, screen} from "@testing-library/react"
import MultiSelectionFilter from "../../components/MultiSelectionFilter"
import userEvent from "@testing-library/user-event"

const mockData = jest.fn()
jest.mock("@appbaseio/reactivesearch", () => ({
  MultiList: ({children}) => <div>{children(mockData())}</div>,
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

const testData = {
  component: "testcomponent",
  dataField: "about.id",
  title: "about",
  placeholder: "about",
  filterLabel: "about",
  queryFormat: "and",
  showMissing: true,
  showFilter: true,
  showSearch: false,
  size: 1000,
  className: "about-card",
  fontAwesome: "",
  URLParams: true,
  and: ["author"],
}

const filterItemsData = {
  component: "testcomponent",
  data: [
    {key: "key1", label: "key1", doc_count: "3"},
    {key: "key2", label: "key2", doc_count: "1"},
  ],
  value: {key2: true},
}

describe("MultiSelectionFilter ==> Test UI", () => {
  const mockDefaultData = () => {
    mockData.mockImplementation(() => {
      return {
        loading: false,
        error: false,
        data: filterItemsData.data,
        value: filterItemsData.value,
        handleChange: () => {},
      }
    })
  }
  it("Filters : should render without crash", () => {
    mockDefaultData()
    render(<MultiSelectionFilter {...testData} />)
    const accordion = screen.getByRole("button", {name: "LABEL.ABOUT"})
    expect(accordion).not.toHaveClass("Mui-expanded")
  })

  it("FilterItemsComponent : should render filter-item-list without crash (no data)", () => {
    mockData.mockImplementation(() => {
      return {
        loading: false,
        error: false,
        data: [],
        value: null,
        handleChange: () => {},
      }
    })
    render(<MultiSelectionFilter {...testData} />)
    const accordion = screen.getByRole("button", {name: "LABEL.ABOUT"})
    userEvent.click(accordion)
    const checkbox = screen.queryByRole("checkbox", {name: "key1 3"})
    expect(checkbox).not.toBeInTheDocument()
  })

  it("FilterItemsComponent : should render filter-item-list without crash", () => {
    mockDefaultData()
    render(<MultiSelectionFilter {...testData} />)
    const accordion = screen.getByRole("button", {name: "LABEL.ABOUT"})
    userEvent.click(accordion)
    const checkbox = screen.getByRole("checkbox", {name: "key1 3"})
    expect(checkbox).toBeInTheDocument()
  })

  it("FilterItemsComponent : should render filter-item-list according to search", () => {
    mockDefaultData()
    render(<MultiSelectionFilter {...testData} showSearch={true} />)
    const accordion = screen.getByRole("button", {name: "LABEL.ABOUT"})
    userEvent.click(accordion)
    const searchBox = screen.getByRole("textbox", {name: "search testcomponent"})
    userEvent.type(searchBox, "2")
    const checkbox1 = screen.queryByRole("checkbox", {name: "key1 3"})
    expect(checkbox1).not.toBeInTheDocument()
    const checkbox2 = screen.getByRole("checkbox", {name: "key2 1"})
    expect(checkbox2).toBeInTheDocument()
  })

  it("Test click on expand accordion button", () => {
    mockDefaultData()
    render(<MultiSelectionFilter {...testData} />)
    const accordion = screen.getByRole("button", {name: "LABEL.ABOUT"})
    userEvent.click(accordion)
    expect(accordion).toHaveClass("Mui-expanded")
  })
})
