import React from "react"
import {shallow} from "../../../setupFiles"
import ErrorComponent from "../../../components/errorPage/ErrorComponent"

describe("ErrorPageComponent ==> UI  ", () => {
  let wrapperShadow
  beforeEach(() => {
    wrapperShadow = shallow(<ErrorComponent />)
  })

  it("MultiListComponent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })

  it(" ErrorPageComponent:  wraps content in a div with .info class", () => {
    expect(wrapperShadow.find(".err-info").length).toBe(1)
  })

  it(" ErrorPageComponent:  Find Text inside Component", () => {
    expect(
      wrapperShadow
        .text()
        .includes("Sorry something was wrong and we can't load the page")
    ).toBe(true)
  })
})
