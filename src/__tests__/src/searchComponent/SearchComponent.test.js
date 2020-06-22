import React from "react"
import {shallow} from "../../../setupFiles"
import {registerConfiguration} from "../../../config/configurationData"
import SearchComponent from "../../../components/searchComponent/SearchComponent"

describe("SearchComponent ==> Test UI  ", () => {
  registerConfiguration()
  const wrapperShadow = shallow(<SearchComponent />)
  it("SearchComponent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })
})
