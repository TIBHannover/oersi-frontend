import React from "react"
import ReactDOM from "react-dom"
import Card from "../../../../components/resultComponent/card/Card"

const fakeData = {
  url: "www.test.com",
  name: "Test name",
  authors: [
    {
      fullname: "Test Test",
    },
    {
      fullname: "Test Test",
    },
  ],
  license: "https://creativecommons.org/licenses/by/4.0/",
  thumbnailUrl: "www.image-test.com",
  description: "this is just a test ",
  keywords: ["test tag1", "test tag2"],
  dateModifiedInternal: "2020-06-17T08:05:02.000Z",
  learningResourceType: "course",
  inLanguage: "de",
  source: "oernds.de",
}

let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div")
  document.body.appendChild(container)
})

describe("CardComponent ==> Test UI  ", () => {
  it("CardComponent : should render without crashing", async () => {
    const div = document.createElement("div")
    ReactDOM.render(<Card {...fakeData} />, div)

    ReactDOM.unmountComponentAtNode(div)
  })
})
