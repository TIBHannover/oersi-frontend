import React from "react"
import ReactDOM from "react-dom"
import LinkComponent from "../../../components/linkComponent/LinkComponent"

describe("LinkComponent ==> Test UI  ", () => {
  it("LinkComponent : should render without crashing", () => {
    const div = document.createElement("div")
    ReactDOM.render(
      <LinkComponent link={"http://test.com"}>
        <span>Test</span>
      </LinkComponent>,
      div
    )
    ReactDOM.unmountComponentAtNode(div)
  })
})
