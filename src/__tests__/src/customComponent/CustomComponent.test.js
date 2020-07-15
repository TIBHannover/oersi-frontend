import React from "react"
import ReactDOM from "react-dom"
import CustomComponent from "../../../components/customComponent/CustomComponent"
import config from "react-global-configuration"
import ShallowRenderer from "react-test-renderer/shallow"
import {act} from "react-dom/test-utils"
import prod from "../../../config/prod"
import * as rdd from "react-device-detect"
beforeEach(() => {
  // setup a config file
  config.set(prod, {freeze: false})
  rdd.isMobile = true
})

describe("CustomComponent ==> Test UI  ", () => {
  it("CustomComponent : should render without crashing for mobile", async () => {
    const renderer = new ShallowRenderer()
    renderer.render(
      <CustomComponent isMobile={true} multilist={config.get("multiList")} />
    )
    const result = renderer.getRenderOutput()
    expect(result.props.isMobile).toEqual(true)
  })

  it("CustomComponent : should render without crashing for desktop", async () => {
    const renderer = new ShallowRenderer()
    renderer.render(
      <CustomComponent isMobile={false} multilist={config.get("multiList")} />
    )
    const result = renderer.getRenderOutput()
    expect(result.props.isMobile).toEqual(false)
  })
})
