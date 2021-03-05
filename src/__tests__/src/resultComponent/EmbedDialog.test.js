import React from "react"
import EmbedDialog from "../../../components/resultComponent/EmbedDialog"
import ReactDOM from "react-dom"
import Dialog from "@material-ui/core/Dialog"
import {createShallow} from "@material-ui/core/test-utils"

let dummyData = {
  id: 1,
  name: "Test",
  licenseGroup: "by-sa",
  license: "https://creativecommons.org/licenses/by-sa/4.0",
  creator: [
    {
      id: null,
      name: "Max Mustermann",
      type: "Person",
    },
  ],
}

function translateDummy(key, options) {
  return key + "_translated"
}
const closeMock = jest.fn()

let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div")
  document.body.appendChild(container)
})
let shallow
beforeAll(() => {
  shallow = createShallow({dive: true})
})
describe("EmbedDialog", () => {
  it("EmbedDialog should render", () => {
    ReactDOM.render(
      <EmbedDialog
        open={true}
        onClose={closeMock}
        data={{...dummyData}}
        t={translateDummy}
      />,
      container
    )
    ReactDOM.unmountComponentAtNode(container)
  })
  it("Test click on copy button", () => {
    document.queryCommandSupported = jest.fn(() => true)
    document.execCommand = jest.fn((x) => true)
    const wrapper = shallow(
      <EmbedDialog
        open={true}
        onClose={closeMock}
        data={{...dummyData}}
        t={translateDummy}
      />
    )

    const button = wrapper.find(Dialog).dive().find(".embed-dialog-copy-button")
    button.simulate("click")
    expect(
      wrapper.find(Dialog).dive().find(".embed-dialog-copy-done-button").length
    ).toEqual(1)
  })
})
