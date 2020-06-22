import React from "react"
import {shallow} from "../../../../setupFiles"
import Card from "../../../../components/resultComponent/card/Card"

describe("Card ==> Test UI  ", () => {
  // registerConfiguration()
  const wrapperShadow = shallow(<Card />)
  it("Card : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })
})
