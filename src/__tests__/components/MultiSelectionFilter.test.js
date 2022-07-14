import React from "react"
import {render, screen, waitFor} from "@testing-library/react"
import MultiSelectionFilter from "../../components/MultiSelectionFilter"
import userEvent from "@testing-library/user-event"
import {OersiConfigContext} from "../../helpers/use-context"

const mockData = jest.fn()
jest.mock("@appbaseio/reactivesearch", () => ({
  MultiList: (props) => (
    <>
      <div aria-label="defaultQuery">
        {props.defaultQuery ? JSON.stringify(props.defaultQuery()) : ""}
      </div>
      <div>{props.children(mockData())}</div>
    </>
  ),
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
  showMissing: true,
  showFilter: true,
  showSearch: false,
  size: 1000,
  className: "about-card",
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

const defaultConfig = {}

describe("MultiSelectionFilter ==> Test UI", () => {
  const FilterWithConfig = (props) => {
    return (
      <OersiConfigContext.Provider
        value={props.appConfig ? props.appConfig : defaultConfig}
      >
        <MultiSelectionFilter {...props} />
      </OersiConfigContext.Provider>
    )
  }
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
    render(<FilterWithConfig {...testData} />)
    const accordion = screen.getByRole("button", {name: "LABEL.ABOUT"})
    expect(accordion).not.toHaveClass("Mui-expanded")
  })

  it("FilterItemsComponent : should render filter-item-list without crash (no data)", async () => {
    mockData.mockImplementation(() => {
      return {
        loading: false,
        error: false,
        data: [],
        value: null,
        handleChange: () => {},
      }
    })
    render(<FilterWithConfig {...testData} />)
    const accordion = screen.getByRole("button", {name: "LABEL.ABOUT"})
    await userEvent.click(accordion)
    const checkbox = screen.queryByRole("checkbox", {name: "key1 3"})
    expect(checkbox).not.toBeInTheDocument()
  })

  it("FilterItemsComponent : should render filter-item-list without crash", async () => {
    mockDefaultData()
    render(<FilterWithConfig {...testData} />)
    const accordion = screen.getByRole("button", {name: "LABEL.ABOUT"})
    await userEvent.click(accordion)
    const checkbox = screen.getByRole("checkbox", {name: "key1 3"})
    expect(checkbox).toBeInTheDocument()
  })

  it("FilterItemsComponent : should render filter-item-list according to search", async () => {
    mockDefaultData()
    render(<FilterWithConfig {...testData} showSearch={true} />)
    const accordion = screen.getByRole("button", {name: "LABEL.ABOUT"})
    await userEvent.click(accordion)
    const searchBox = screen.getByRole("textbox", {name: "search testcomponent"})
    await userEvent.type(searchBox, "2")
    const checkbox1 = screen.queryByRole("checkbox", {name: "key1 3"})
    expect(checkbox1).not.toBeInTheDocument()
    const checkbox2 = screen.getByRole("checkbox", {name: "key2 1"})
    expect(checkbox2).toBeInTheDocument()
  })

  it("FilterItemsComponent : prevent search that does not match the allowed characters", async () => {
    mockDefaultData()
    const data = {...testData, allowedSearchRegex: /^[a-zA-Z]*$/}
    render(<FilterWithConfig {...data} showSearch={true} />)
    const accordion = screen.getByRole("button", {name: "LABEL.ABOUT"})
    await userEvent.click(accordion)
    const searchBox = screen.getByRole("textbox", {name: "search testcomponent"})
    await userEvent.type(searchBox, "2")
    const checkbox1 = screen.queryByRole("checkbox", {name: "key1 3"})
    expect(checkbox1).toBeInTheDocument()
    const checkbox2 = screen.getByRole("checkbox", {name: "key2 1"})
    expect(checkbox2).toBeInTheDocument()
  })

  it("Test click on expand accordion button", async () => {
    mockDefaultData()
    render(<FilterWithConfig {...testData} />)
    const accordion = screen.getByRole("button", {name: "LABEL.ABOUT"})
    await userEvent.click(accordion)
    expect(accordion).toHaveClass("Mui-expanded")
  })

  it("FilterItemsComponent: Test default query from component-config", () => {
    mockDefaultData()
    const data = {
      ...testData,
      defaultQuery: () => {
        return {test: "fromConfig"}
      },
    }
    render(<FilterWithConfig {...data} />)
    const defaultQuery = screen.getByLabelText("defaultQuery")
    expect(defaultQuery).toHaveTextContent('{"test":"fromConfig"}')
  })

  it("FilterItemsComponent: aggs search for search term", async () => {
    mockDefaultData()
    const data = {
      ...testData,
      showSearch: true,
    }
    const appConfig = {
      AGGREGATION_SEARCH_COMPONENTS: [testData.component],
      AGGREGATION_SEARCH_DEBOUNCE: 0,
      AGGREGATION_SEARCH_MIN_LENGTH: 3,
    }
    render(<FilterWithConfig {...data} appConfig={appConfig} />)
    const accordion = screen.getByRole("button", {name: "LABEL.ABOUT"})
    await userEvent.click(accordion)
    const searchField = screen.getByRole("textbox", {name: "search testcomponent"})
    await userEvent.type(searchField, "abc")
    await waitFor(() => {
      expect(screen.getByLabelText("defaultQuery")).not.toHaveTextContent("null")
    }).catch((err) => {})
    const defaultQuery = screen.getByLabelText("defaultQuery")
    expect(defaultQuery.textContent).toContain('"aggs"')
    expect(defaultQuery.textContent).toContain("abc")
  })

  it("FilterItemsComponent: no aggs search for short search term", async () => {
    mockDefaultData()
    const data = {
      ...testData,
      showSearch: true,
    }
    const appConfig = {
      AGGREGATION_SEARCH_COMPONENTS: [testData.component],
      AGGREGATION_SEARCH_DEBOUNCE: 0,
      AGGREGATION_SEARCH_MIN_LENGTH: 3,
    }
    render(<FilterWithConfig {...data} appConfig={appConfig} />)
    const accordion = screen.getByRole("button", {name: "LABEL.ABOUT"})
    await userEvent.click(accordion)
    const searchField = screen.getByRole("textbox", {name: "search testcomponent"})
    await userEvent.type(searchField, "a")
    await waitFor(() => {
      expect(screen.getByLabelText("defaultQuery")).not.toHaveTextContent("null")
    }).catch((err) => {})
    const defaultQuery = screen.getByLabelText("defaultQuery")
    expect(defaultQuery).toHaveTextContent("null")
  })

  it("FilterItemsComponent: no aggs search for empty search term", async () => {
    mockDefaultData()
    const data = {
      ...testData,
      showSearch: true,
    }
    const appConfig = {
      AGGREGATION_SEARCH_COMPONENTS: [testData.component],
      AGGREGATION_SEARCH_DEBOUNCE: 0,
      AGGREGATION_SEARCH_MIN_LENGTH: 3,
    }
    render(<FilterWithConfig {...data} appConfig={appConfig} />)
    const accordion = screen.getByRole("button", {name: "LABEL.ABOUT"})
    await userEvent.click(accordion)
    const searchField = screen.getByRole("textbox", {name: "search testcomponent"})
    await userEvent.clear(searchField)
    await waitFor(() => {
      expect(screen.getByLabelText("defaultQuery")).not.toHaveTextContent("null")
    }).catch((err) => {})
    const defaultQuery = screen.getByLabelText("defaultQuery")
    expect(defaultQuery).toHaveTextContent("null")
  })

  it("FilterItemsComponent: expand children of hierarchical filter", async () => {
    mockDefaultData()
    const data = {
      ...testData,
      showSearch: true,
    }
    const appConfig = {
      HIERARCHICAL_FILTERS: [
        {
          componentId: "testcomponent",
          schemeParentMap: "/vocabs/hochschulfaechersystematik-parentMap.json",
        },
      ],
    }
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => JSON.parse('{"key2": "key3", "key3": "key1"}'),
      })
    )

    render(<FilterWithConfig {...data} appConfig={appConfig} />)
    const accordion = screen.getByRole("button", {name: "LABEL.ABOUT"})
    await userEvent.click(accordion)
    const expandKey1Button = screen.getByRole("button", {
      name: "Expand key1 children",
    })
    await userEvent.click(expandKey1Button)
    const expandKey3Button = screen.getByRole("button", {
      name: "Expand key3 children",
    })
    await userEvent.click(expandKey3Button)
    expect(screen.queryByRole("checkbox", {name: "key2 1"})).toBeInTheDocument()
  })
})
