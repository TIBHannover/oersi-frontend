import React from "react"
import {shallow} from "../../../setupFiles"
import {registerConfiguration} from "../../../config/configurationData"
import Configuration from "../../../components/configuration/Configuration"

describe("Configuration ==> Test UI  ", () => {
  registerConfiguration()
  const wrapperShadow = shallow(<Configuration />)
  it("Configuration : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })
})
