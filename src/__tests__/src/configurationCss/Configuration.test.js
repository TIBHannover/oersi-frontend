import React from "react"
import {shallow, mount} from "../../../setupFiles"
import Configuration from "../../../components/configurationCss/Configuration-Css"
import {cleanup} from "@testing-library/react"

describe("Configuration ==> Test UI  ", () => {
  let wrapperShallow
  beforeEach(() => {
    wrapperShallow = shallow(<Configuration />)
  })
  afterEach(() => {
    cleanup()
  })
  it("Configuration : should render correctly", () => {
    expect(wrapperShallow).toMatchSnapshot()
  })

  it("Configuration : instance should not be null", () => {
    expect(wrapperShallow.instance() !== null).toBe(true)
  })
  it("Configuration : instance should not be null", () => {
    const wrapperMount = mount(<Configuration />)
    const instance = wrapperMount.instance()
    const spy = jest.spyOn(instance, "loadExternalStyles")
    wrapperMount.update()
    instance.loadExternalStyles("")
    expect(spy).toBeCalled()
  })
})
