import FooterComponent from "../../../components/footerComponent/FooterComponent"
import React from "react"
import {mount, shallow} from "../../../setupFiles"

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

  it(" FooterComponent:  Find Text Blog inside  Component", () => {
    expect(wrapperShadow.text().includes("Blog")).toBe(true)
  })
  it(" FooterComponent:  Find Text Datenschutz  inside Component", () => {
    expect(wrapperShadow.text().includes("Datenschutz")).toBe(true)
  })
})
