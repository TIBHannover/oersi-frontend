import React from "react"
import ReactDOM from "react-dom"
import HeaderComponent from "../../../components/headerComponent/HeaderComponent"

describe("HeaderComponent ==> Test UI  ", () => {
  it("HeaderComponent : should render without crashing", () => {
    const div = document.createElement("div")
    ReactDOM.render(
      <HeaderComponent>
        <h3>Test</h3>
      </HeaderComponent>,
      div
    )
    ReactDOM.unmountComponentAtNode(div)
  })
})
