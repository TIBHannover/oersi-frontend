import React from "react"
import {render} from "@testing-library/react"
import Filters from "../../components/Filters"

jest.mock("../../components/MultiSelectionFilter", () => () => (
  <div className="multiList"></div>
))

describe("Filters ==> Test UI", () => {
  it("Filters : should render with empty list", () => {
    render(<Filters multilist={[]} />)
  })

  it("Filters : should render", () => {
    const multilist = [{component: "filter1"}, {component: "filter2"}]
    const {container} = render(<Filters multilist={multilist} />)
    const filterElements = Array.from(container.querySelectorAll(".multiList"))
    expect(filterElements).toHaveLength(2)
  })
})
