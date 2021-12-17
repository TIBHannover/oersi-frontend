import React from "react"
import {shallow} from "../../setupTests"
import {registerConfiguration} from "../../config/configurationData"
import SearchField from "../../components/SearchField"

describe("SearchComponent ==> Test UI  ", () => {
  registerConfiguration()
  const wrapperShadow = shallow(<SearchField />)
  it("SearchComponent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })
})
