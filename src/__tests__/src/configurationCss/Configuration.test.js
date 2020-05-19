import React from "react"
import {shallow} from "../../../setupFiles"
import Configuration from "../../../components/configurationCss/Configuration-Css"
import {cleanup} from "@testing-library/react"
import {getConfiguration} from "../../../service/configuration/configurationService"

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
})
describe("ExampleComponent", () => {
  it("fetches data from server when server returns a successful response", (done) => {
    const mockSuccessResponse = {}
    const mockJsonPromise = Promise.resolve(mockSuccessResponse)
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
    })
    jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise)

    const wrapper = shallow(<Configuration />)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith("/css/style-override.css")

    process.nextTick(() => {
      expect(wrapper.state()).toEqual(null)

      global.fetch.mockClear()
      done()
    })
  })
})
