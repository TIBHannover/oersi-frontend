import React from "react"
import ReactDOM from "react-dom"
import {act} from "react-dom/test-utils"
import FooterComponent from "../../../components/footerComponent/FooterComponent"
const footerFakehtml = "<p>this is a test</p>"

global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve(footerFakehtml),
  })
)

let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div")
  document.body.appendChild(container)
})

describe("FooterComponent ==> Test UI  ", () => {
  it("FooterComponent : should render without crashing", async () => {
    await act(async () => {
      ReactDOM.render(<FooterComponent />, container)
    })

    ReactDOM.unmountComponentAtNode(container)
  })
})
