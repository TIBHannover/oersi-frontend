import React from "react"
import ShallowRenderer from "react-test-renderer/shallow"
import config from "react-global-configuration"
import prod from "../../../config/prod"
import FilterComponent from "../../../components/filterComponent/FilterComponent"
beforeEach(() => {
  // setup a config file
  config.set(prod, {freeze: false})
})

describe("FilterComponent ==> Test UI  ", () => {
  it("FilterComponent : should render without crashing", async () => {
    const renderer = new ShallowRenderer()
    renderer.render(<FilterComponent multilist={config.get("multiList")} />)
    const result = renderer.getRenderOutput()
    expect(result.props.children[1].type).toBe("div")
  })
})
