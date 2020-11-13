import React from "react"
import {shallow} from "../../../setupTests"
import {registerConfiguration} from "../../../config/configurationData"
import MultiListComponent from "../../../components/multiListComponent/MultiListComponent"

describe("MultiListComponent ==> Test UI  ", () => {
  registerConfiguration()
  const wrapperShadow = shallow(<MultiListComponent />)
  it("MultiListComponent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })
})
