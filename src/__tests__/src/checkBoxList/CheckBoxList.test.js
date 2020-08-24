import React from "react"
import ReactDOM from "react-dom"
import CheckboxList from "../../../components/multiDropDownComponent/CheckboxList"

const fakeData = [
  {
    key: "Test",
    doc_count: "23",
  },
  {
    key: "de",
    doc_count: "13",
  },
  {
    key: "https://www.oernds.de/edu-sharing/",
    doc_count: "13",
  },
]

let container = null
beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
})

describe("CheckboxList ==> Test UI  ", () => {
  it("CustomComponent : should render without crashing for desktop", () => {
    ReactDOM.render(<CheckboxList data={fakeData} title={"Test"} />, container)
    ReactDOM.unmountComponentAtNode(container)
  })
})
