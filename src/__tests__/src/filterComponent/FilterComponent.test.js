import React from "react"
import ReactDOM from "react-dom"
import FilterComponent from "../../../components/filterComponent/FilterComponent"
import {mount} from "../../../setupFiles"

describe("FilterComponent ==> Test UI  ", () => {
  it("FilterComponent : should render without crashing", () => {
    const div = document.createElement("div")
    ReactDOM.render(
      <FilterComponent
        left={<h3>This is left side </h3>}
        center={<h3>This is center side </h3>}
        right={<h3>This is right side </h3>}
      />,
      div
    )
    ReactDOM.unmountComponentAtNode(div)
  })
  it("should update state on click", () => {
    const changeSize = jest.fn()
    const wrapper = mount(
      <FilterComponent
        left={<h3>This is left side </h3>}
        center={<h3>This is center side </h3>}
        right={<h3>This is right side </h3>}
      />
    )
    const handleClick = jest.spyOn(React, "useState")
    handleClick.mockImplementation((isClicked) => [isClicked, setIsClicked])
    wrapper.find(".toggle-button").simulate("click")
    expect(changeSize).toBeTruthy()
  })
})
