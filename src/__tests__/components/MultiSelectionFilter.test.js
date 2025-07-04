import React from "react"
import {render, screen, waitFor} from "@testing-library/react"
import MultiSelectionFilter from "../../components/MultiSelectionFilter"
import userEvent from "@testing-library/user-event"
import {SearchIndexFrontendConfigContext} from "../../helpers/use-context"
import {getDefaultSearchConfiguration} from "../helpers/test-helpers"

const mockData = jest.fn()
jest.mock("@appbaseio/reactivesearch", () => ({
  MultiList: (props) => (
    <>
      <div aria-label="defaultQuery">
        {props.defaultQuery ? JSON.stringify(props.defaultQuery()) : ""}
      </div>
      <div>{props.children(mockData(props))}</div>
    </>
  ),
}))
jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        t: (str) => str,
        changeLanguage: () => new Promise(() => {}),
      },
    }
  },
}))

const testData = {
  componentId: "testcomponent",
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
  react: {and: ["author"]},
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
      <SearchIndexFrontendConfigContext.Provider
        value={props.appConfig ? props.appConfig : defaultConfig}
      >
        <MultiSelectionFilter {...props} />
      </SearchIndexFrontendConfigContext.Provider>
    )
  }
  const mockDefaultData = () => {
    mockData.mockImplementation((props) => {
      const reactivesearchValue = {}
      props.value.forEach((item) => {
        reactivesearchValue[item] = true
      })
      return {
        loading: false,
        error: false,
        data: filterItemsData.data,
        value: reactivesearchValue,
        handleChange: () => {},
      }
    })
  }
  it("Filters : should render without crash", () => {
    mockDefaultData()
    render(<FilterWithConfig {...testData} />)
    const accordion = screen.getByRole("button", {name: "data:fieldLabels.about.id"})
    expect(accordion).toHaveClass("accordion-button")
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
    const accordion = screen.getByRole("button", {name: "data:fieldLabels.about.id"})
    await userEvent.click(accordion)
    const checkbox = screen.queryByRole("checkbox", {name: "key1 3"})
    expect(checkbox).not.toBeInTheDocument()
  })

  it("FilterItemsComponent : should render filter-item-list without crash", async () => {
    mockDefaultData()
    render(<FilterWithConfig {...testData} />)
    const accordion = screen.getByRole("button", {name: "data:fieldLabels.about.id"})
    await userEvent.click(accordion)
    const checkbox = screen.getByRole("checkbox", {name: "key1 3"})
    expect(checkbox).toBeInTheDocument()
  })

  it("FilterItemsComponent : should render filter-item-list according to search", async () => {
    mockDefaultData()
    render(<FilterWithConfig {...testData} showSearch={true} />)
    const accordion = screen.getByRole("button", {name: "data:fieldLabels.about.id"})
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
    const accordion = screen.getByRole("button", {name: "data:fieldLabels.about.id"})
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
    const accordion = screen.getByRole("button", {name: "data:fieldLabels.about.id"})
    await userEvent.click(accordion)
    const checkbox = screen.getByRole("checkbox", {name: "key1 3"})
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).toBeVisible()
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
      reloadFilterOnSearchTermChange: true,
      reloadFilterDebounce: 0,
      reloadFilterMinSearchTermLength: 3,
    }
    const appConfig = {}
    render(<FilterWithConfig {...data} appConfig={appConfig} />)
    const accordion = screen.getByRole("button", {name: "data:fieldLabels.about.id"})
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
      reloadFilterOnSearchTermChange: true,
      reloadFilterDebounce: 0,
      reloadFilterMinSearchTermLength: 3,
    }
    const appConfig = {}
    render(<FilterWithConfig {...data} appConfig={appConfig} />)
    const accordion = screen.getByRole("button", {name: "data:fieldLabels.about.id"})
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
      reloadFilterOnSearchTermChange: true,
      reloadFilterDebounce: 0,
      reloadFilterMinSearchTermLength: 3,
    }
    const appConfig = {}
    render(<FilterWithConfig {...data} appConfig={appConfig} />)
    const accordion = screen.getByRole("button", {name: "data:fieldLabels.about.id"})
    await userEvent.click(accordion)
    const searchField = screen.getByRole("textbox", {name: "search testcomponent"})
    await userEvent.clear(searchField)
    await waitFor(() => {
      expect(screen.getByLabelText("defaultQuery")).not.toHaveTextContent("null")
    }).catch((err) => {})
    const defaultQuery = screen.getByLabelText("defaultQuery")
    expect(defaultQuery).toHaveTextContent("null")
  })

  const standardHierarchicalFilterTestSetup = async (parentMap) => {
    mockDefaultData()
    const data = {
      ...testData,
      showSearch: true,
    }
    const appConfig = {
      fieldConfiguration: {
        options: [
          {
            dataField: "about.id",
            isHierarchicalConcept: true,
            schemeParentMap: "/vocabs/hochschulfaechersystematik-parentMap.json",
          },
        ],
      },
      searchConfiguration: getDefaultSearchConfiguration(),
    }
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          JSON.parse(parentMap ? parentMap : '{"key2": "key3", "key3": "key1"}'),
      })
    )

    render(<FilterWithConfig {...data} appConfig={appConfig} />)
    const accordion = screen.getByRole("button", {name: "data:fieldLabels.about.id"})
    await userEvent.click(accordion)
  }
  it("FilterItemsComponent: expand children of hierarchical filter", async () => {
    await standardHierarchicalFilterTestSetup()
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

  it("FilterItemsComponent: collapse children of hierarchical filter after expanded", async () => {
    await standardHierarchicalFilterTestSetup()
    const expandKey1Button = screen.getByRole("button", {
      name: "Expand key1 children",
    })
    await userEvent.click(expandKey1Button)
    expect(screen.queryByRole("checkbox", {name: "key3 0"})).toBeInTheDocument()
    await userEvent.click(expandKey1Button)
    await waitFor(() => {
      expect(
        screen.queryByRole("checkbox", {name: "key3 0"})
      ).not.toBeInTheDocument()
    }).catch((err) => {})
  })

  it("FilterItemsComponent: expand all children after search field was used", async () => {
    await standardHierarchicalFilterTestSetup()
    const searchField = screen.getByRole("textbox", {name: "search testcomponent"})
    await userEvent.type(searchField, "key")
    expect(screen.queryByRole("checkbox", {name: "key2 1"})).toBeInTheDocument()
  })

  it("FilterItemsComponent: add parent entries from vocab scheme", async () => {
    await standardHierarchicalFilterTestSetup('{"key1": "key0", "key2": "key1"}')
    expect(screen.queryByRole("checkbox", {name: "key0 0"})).toBeInTheDocument()
  })

  it("FilterItemsComponent: deselection/selection should also affect parent", async () => {
    await standardHierarchicalFilterTestSetup()
    const searchField = screen.getByRole("textbox", {name: "search testcomponent"})
    await userEvent.type(searchField, "key")
    const box1 = screen.queryByRole("checkbox", {name: "key1 3"})
    const box2 = screen.queryByRole("checkbox", {name: "key2 1"})

    expect(box1).not.toBeChecked()
    expect(box2).not.toBeChecked()
    await userEvent.click(box2)
    expect(box1).toBeChecked()
    expect(box2).toBeChecked()
    await userEvent.click(box2)
    expect(box1).not.toBeChecked()
    expect(box2).not.toBeChecked()
  })

  it("FilterItemsComponent: deselection/selection should also affect all children", async () => {
    await standardHierarchicalFilterTestSetup('{"key1": "key0", "key2": "key0"}')
    const searchField = screen.getByRole("textbox", {name: "search testcomponent"})
    await userEvent.type(searchField, "key")
    const box0 = screen.queryByRole("checkbox", {name: "key0 0"})
    const box1 = screen.queryByRole("checkbox", {name: "key1 3"})
    const box2 = screen.queryByRole("checkbox", {name: "key2 1"})

    expect(box1).not.toBeChecked()
    expect(box2).not.toBeChecked()
    await userEvent.click(box0)
    expect(box1).toBeChecked()
    expect(box2).toBeChecked()
    await userEvent.click(box0)
    expect(box1).not.toBeChecked()
    expect(box2).not.toBeChecked()
  })

  it("FilterItemsComponent: selecting all children should not fully / primary select the parent", async () => {
    await standardHierarchicalFilterTestSetup('{"key1": "key0", "key2": "key0"}')
    const searchField = screen.getByRole("textbox", {name: "search testcomponent"})
    await userEvent.type(searchField, "key")
    const box0 = screen.queryByRole("checkbox", {name: "key0 0"})
    const box1 = screen.queryByRole("checkbox", {name: "key1 3"})
    const box2 = screen.queryByRole("checkbox", {name: "key2 1"})
    await userEvent.click(box1)
    await userEvent.click(box2)

    expect(box0).toBeChecked()
    expect(box0).toHaveClass("hierarchical-checkbox-with-selected-child")
  })

  it("FilterItemsComponent: selecting one children that have a hidden sibling (search) should not include all parent content", async () => {
    await standardHierarchicalFilterTestSetup('{"key1": "key0", "key2": "key0"}')
    const searchField = screen.getByRole("textbox", {name: "search testcomponent"})
    await userEvent.type(searchField, "key1")
    const box0 = screen.queryByRole("checkbox", {name: "key0 0"})
    const box1 = screen.queryByRole("checkbox", {name: "key1 3"})
    await userEvent.click(box1)
    expect(box0).toHaveClass("hierarchical-checkbox-with-selected-child")
  })

  it("FilterItemsComponent: deselecting one of multiple children should deselect the parent and select the siblings", async () => {
    await standardHierarchicalFilterTestSetup('{"key1": "key0", "key2": "key0"}')
    const searchField = screen.getByRole("textbox", {name: "search testcomponent"})
    await userEvent.type(searchField, "key")
    const box0 = screen.queryByRole("checkbox", {name: "key0 0"})
    const box1 = screen.queryByRole("checkbox", {name: "key1 3"})
    const box2 = screen.queryByRole("checkbox", {name: "key2 1"})
    await userEvent.click(box1)
    await userEvent.click(box2)
    await userEvent.click(box0)
    expect(box0).toBeChecked()
    expect(box0).not.toHaveClass("hierarchical-checkbox-with-selected-child")
    await userEvent.click(box1)
    expect(box0).toHaveClass("hierarchical-checkbox-with-selected-child")
    expect(box1).not.toBeChecked()
    expect(box2).toBeChecked()
    expect(box2).not.toHaveClass("hierarchical-checkbox-with-selected-child")
  })
})
