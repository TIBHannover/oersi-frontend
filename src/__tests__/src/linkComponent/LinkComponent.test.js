import React from "react"
import {shallow} from "../../../setupFiles"
import {registerConfiguration} from "../../../config/configurationData"
import LinkComponent from "../../../components/linkComponent/LinkComponent"

describe("LinkComponent ==> Test UI  ", () => {
  registerConfiguration()
  const wrapperShadow = shallow(<LinkComponent />)
  it("should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })
})
