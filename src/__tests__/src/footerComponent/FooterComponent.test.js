import React from "react"
import {shallow} from "../../../setupFiles"
import {registerConfiguration} from "../../../config/configurationData"
import FooterComponent from "../../../components/footerComponent/FooterComponent"

describe("FooterComponent ==> Test UI  ", () => {
  registerConfiguration()
  const wrapperShadow = shallow(<FooterComponent />)
  it("FooterComponent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })
})
