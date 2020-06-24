import React from "react"
import ReactDOM from "react-dom"
import ToastComponent from "../../../components/toast/ToastComponent"

let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div")
  document.body.appendChild(container)
})

describe("ToastComponent ==> Test UI  ", () => {
  it("ToastComponent : should render without crashing", async () => {
    const div = document.createElement("div")
    ReactDOM.render(
      <ToastComponent
        message={"Test message "}
        title={"Test title"}
        type={"success"}
      />,
      div
    )

    ReactDOM.unmountComponentAtNode(div)
  })
})
