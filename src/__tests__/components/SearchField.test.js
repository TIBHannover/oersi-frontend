import React from "react"
import {shallow} from "../../setupTests"
import {registerConfiguration} from "../../config/configurationData"
import SearchField from "../../components/SearchField"

describe("SearchField ==> Test UI  ", () => {
  registerConfiguration()
  const wrapperShadow = shallow(<SearchField />)
  it("SearchField : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })
})
