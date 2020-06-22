import React from "react"
import {shallow} from "../../../setupFiles"
import {registerConfiguration} from "../../../config/configurationData"
import ErrorComponent from "../../../components/errorPage/ErrorComponent"

describe("ErrorComponent ==> Test UI  ", () => {
  registerConfiguration()
  const wrapperShadow = shallow(<ErrorComponent />)
  it("ErrorComponent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })
})
