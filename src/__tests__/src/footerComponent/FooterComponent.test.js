import FooterComponent from "../../../components/footerComponent/FooterComponent"
import React from "react"
import {shallow} from "../../../setupFiles"

describe("FooterComponent ==> UI  ", () => {
  let wrapperShadow
  beforeEach(() => {
    wrapperShadow = shallow(<FooterComponent />)
  })

  it("FooterComponent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })

  it(" FooterComponent:  wraps content in a div with .copyright pull-right", () => {
    expect(wrapperShadow.find("footer").length).toBe(1)
  })
})
