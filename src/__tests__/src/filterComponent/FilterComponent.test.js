import React from "react"
import {shallow} from "../../../setupFiles"
import {registerConfiguration} from "../../../config/configurationData"
import FilterComponent from "../../../components/filterComponent/FilterComponent"

describe("FilterComponent ==> Test UI  ", () => {
  registerConfiguration()
  const wrapperShadow = shallow(<FilterComponent />)
  it("FilterComponent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })
})
