import React from "react"
import {render} from "@testing-library/react"
import {MultiListComponent} from "../../../components/multiListComponent/MultiListComponent"

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

describe("MultiListComponent ==> Test UI", () => {
  it("FiltersComponent : should render", () => {
    const {container} = render(
      <MultiListComponent t={translateDummy} {...testData} />
    )
  })
})
