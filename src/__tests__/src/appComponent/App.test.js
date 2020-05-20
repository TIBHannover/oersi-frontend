import React from "react"
import {shallow} from "../../../setupFiles"
import AppComponent from "../../../App"
import {registerConfiguration} from "../../../config/configurationData"

const credencialTest = {
  ELASTIC_SEARCH: {
    URL: "localhost:9200/",
    CREDENCIAL: "cxcxcxcxcx",
    APP_NAME: "oer_test",
  },
}

describe("AppComponent ==> Test UI  ", () => {
  let wrapperShadow
  beforeEach(() => {
    registerConfiguration()
    wrapperShadow = shallow(<AppComponent data={credencialTest.ELASTIC_SEARCH} />)
  })

  it("AppComponent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })

  it(" AppComponent:  should  wraps content in a div with .wrapper class", () => {
    expect(wrapperShadow.find(".wrapper").length).toBe(1)
  })
})

describe("AppComponent  ==> Test Status of Component", () => {
  let wrapperShadow
  beforeEach(() => {
    registerConfiguration()
    wrapperShadow = shallow(<AppComponent data={credencialTest.ELASTIC_SEARCH} />)
  })

  it(" AppComponent:  should call the function checkIfExeistCredencial and returnobject", () => {
    let basicAuth = "Basic AXKELFJCMMDJdjksdsdj23.."
    const result = wrapperShadow.instance().checkIfExeistCredencial(basicAuth)
    expect(result).toEqual({authorization: "Basic AXKELFJCMMDJdjksdsdj23.."})
  })
  it(" AppComponent:  should call the function checkIfExeistCredencial and return null ", () => {
    let basicAuth = ""
    const result = wrapperShadow.instance().checkIfExeistCredencial(basicAuth)
    expect(result).toEqual(null)
  })

  it("AppComponent :  should  State must be not empty ", () => {
    expect(wrapperShadow.state()).toBeTruthy()
  })

  it(" ResultComponent:  should  change status  ", () => {
    wrapperShadow.setState({componentTest: "Test"})
    expect(wrapperShadow.state().componentTest).toEqual("Test")
  })
})
