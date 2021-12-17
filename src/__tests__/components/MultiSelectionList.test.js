import React from "react"
import {render} from "@testing-library/react"
import {
  MultiSelectionItems,
  MultiSelectionList,
  onItemRender,
} from "../../components/MultiSelectionList"
import {createMount} from "@material-ui/core/test-utils"

jest.mock("@appbaseio/reactivesearch")

function translateDummy(key, options) {
  return key + "_translated"
}

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

describe("MultiSelectionList ==> Test UI", () => {
  it("Filters : should render without crash", () => {
    const {container} = render(
      <MultiSelectionList t={translateDummy} {...testData} />
    )
  })

  it("Filters : should render item without crash", () => {
    onItemRender("test", 0, "test", translateDummy)
  })

  it("FilterItemsComponent : should render filter-item-list without crash (no data)", () => {
    const {container} = render(<MultiSelectionItems t={translateDummy} />)
  })

  it("FilterItemsComponent : should render filter-item-list without crash", () => {
    const {container} = render(
      <MultiSelectionItems t={translateDummy} {...filterItemsData} />
    )
  })

  it("Test click on expand accordion button", () => {
    let mount = createMount()
    const wrapper = mount(<MultiSelectionList t={translateDummy} {...testData} />)
    const button = wrapper.find(".MuiButtonBase-root").first()
    button.simulate("click")
    expect(wrapper.find(".Mui-expanded").length).toBeGreaterThanOrEqual(1)
    mount.cleanUp()
  })
})
