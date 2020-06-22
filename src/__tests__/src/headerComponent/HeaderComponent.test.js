import React from "react"
import {shallow} from "../../../setupFiles"
import {registerConfiguration} from "../../../config/configurationData"
import HeaderComponent from "../../../components/headerComponent/HeaderComponent"

describe("HeaderComponent ==> Test UI  ", () => {
  registerConfiguration()
  const wrapperShadow = shallow(<HeaderComponent />)
  it("HeaderComponent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })
})
