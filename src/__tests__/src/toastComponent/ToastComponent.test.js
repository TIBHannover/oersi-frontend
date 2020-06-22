import React from "react"
import {shallow} from "../../../setupFiles"
import {registerConfiguration} from "../../../config/configurationData"
import ToastComponent from "../../../components/toast/ToastComponent"

describe("ToastComponent ==> Test UI  ", () => {
  registerConfiguration()
  const wrapperShadow = shallow(<ToastComponent />)
  it("ToastComponent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })
})
