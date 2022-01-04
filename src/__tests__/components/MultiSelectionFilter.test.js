import React from "react"
import {render, screen} from "@testing-library/react"
import {
  MultiSelectionItems,
  MultiSelectionFilter,
  onItemRender,
} from "../../components/MultiSelectionFilter"
import userEvent from "@testing-library/user-event"

jest.mock("@appbaseio/reactivesearch", () => ({
  MultiList: () => <div />,
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
  component: "about",
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
    {key: "key1", doc_count: "3"},
    {key: "key2", doc_count: "1"},
  ],
  value: {key2: true},
}

describe("MultiSelectionFilter ==> Test UI", () => {
  it("Filters : should render without crash", () => {
    render(<MultiSelectionFilter {...testData} />)
    const accordion = screen.getByRole("button", {name: "LABEL.ABOUT"})
    expect(accordion).not.toHaveClass("Mui-expanded")
  })

  it("Filters : should render item without crash", () => {
    onItemRender("test", 0, "test", (s) => s)
  })

  it("FilterItemsComponent : should render filter-item-list without crash (no data)", () => {
    render(<MultiSelectionItems t={(s) => s} />)
    const checkbox = screen.queryByRole("checkbox", {name: "key1 3"})
    expect(checkbox).not.toBeInTheDocument()
  })

  it("FilterItemsComponent : should render filter-item-list without crash", () => {
    render(<MultiSelectionItems t={(s) => s} {...filterItemsData} />)
    const checkbox = screen.getByRole("checkbox", {name: "key1 3"})
    expect(checkbox).toBeInTheDocument()
  })

  it("Test click on expand accordion button", () => {
    render(<MultiSelectionFilter {...testData} />)
    const accordion = screen.getByRole("button", {name: "LABEL.ABOUT"})
    userEvent.click(accordion)
    expect(accordion).toHaveClass("Mui-expanded")
  })
})
