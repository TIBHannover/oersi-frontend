import React from "react"
import {shallow} from "../../setupTests"
import {registerConfiguration} from "../../config/configurationData"
import SearchResultList from "../../components/SearchResultList"

describe("SearchResultList ==> Test UI  ", () => {
  registerConfiguration()
  const wrapperShadow = shallow(<SearchResultList />)
  it("SearchResultList : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })
})
