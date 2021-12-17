import React from "react"
import {shallow} from "../../setupTests"
import {registerConfiguration} from "../../config/configurationData"
import SearchResultList from "../../components/SearchResultList"

describe("ResultComponent ==> Test UI  ", () => {
  registerConfiguration()
  const wrapperShadow = shallow(<SearchResultList />)
  it("ResultComponent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })
})
