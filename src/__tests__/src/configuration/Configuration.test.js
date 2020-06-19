import React from "react"
import {mount, shallow} from "../../../setupFiles"
import Configuration from "../../../components/configuration/Configuration"
import {registerConfiguration} from "../../../config/configurationData"
import App from "../../../App"
import ErrorComponent from "../../../components/errorPage/ErrorComponent"

var newStatus = {
  name: "Production",
  ELASTIC_SEARCH: {
    URL: "http://localhost:9200/",
    CREDENCIAL: "",
    APP_NAME: "oer_data",
  },
}
describe("Configuration ==> Test UI  ", () => {
  let wrapperShallow
  beforeEach(() => {
    registerConfiguration()
    wrapperShallow = shallow(<Configuration />)
  })

  it("Configuration : should render correctly", () => {
    expect(wrapperShallow).toMatchSnapshot()
  })

  it(" Configuration:  On UNSAFE_componentWillUnmount will remove data  ", () => {
    wrapperShallow.instance().UNSAFE_componentWillUnmount()
    expect(wrapperShallow.state().isLoaded).toEqual(false)
    expect(wrapperShallow.state().configData).toEqual({})
  })
  it("Configuration : should be able to call render App Component   ", () => {
    const instance = wrapperShallow.instance()
    instance.setState({
      configData: newStatus.ELASTIC_SEARCH,
      isLoaded: true,
    })

    expect(wrapperShallow.find(App).render()).toHaveLength(1)
  })

  it("Configuration : should be able to call render Error Component    ", () => {
    const instance = wrapperShallow.instance()
    instance.setState({
      configData: null,
      isLoaded: true,
    })
    expect(
      wrapperShallow
        .find(ErrorComponent)
        .render()
        .text()
        .includes("Sorry something was wrong and we can't load the page")
    ).toBe(true)
  })
})

describe("Configuration  ==> Test Status of Component", () => {
  let wrapperMount
  beforeEach(() => {
    registerConfiguration()
    wrapperMount = mount(<Configuration />)
  })

  it("Configuration : should be state {configData:{}, isLoaded=false} first time   ", () => {
    expect(wrapperMount.state().isLoaded).toEqual(false)
    expect(wrapperMount.state().configData).toEqual({})
  })

  it("Configuration : should be able to change Status   ", () => {
    wrapperMount.setState(newStatus)
    wrapperMount.update()
    expect(wrapperMount.state().isLoaded).toEqual(false)
    expect(wrapperMount.state().configData).toBeTruthy()
  })
})
