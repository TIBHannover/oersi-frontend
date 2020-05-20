import React from "react"
import {shallow} from "../../../setupFiles"
import SearchComponent from "../../../components/searchComponent/SearchComponent"
import config from "react-global-configuration"
import {registerConfiguration} from "../../../config/configurationData"
import {DataSearch} from "@appbaseio/reactivesearch"

describe("SearchComponent ==> Test UI  ", () => {
  let wrapperShadow
  beforeEach(() => {
    registerConfiguration()
    wrapperShadow = shallow(<SearchComponent />)
  })

  it("SearchComponent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })

  it(" SearchComponent:  should  wraps content in a div with .card class", () => {
    expect(wrapperShadow.find(".card").length).toBe(1)
  })

  it(" SearchComponent:  should  wraps content in a  with DataSearch component class", () => {
    expect(wrapperShadow.find(DataSearch).length).toBe(1)
  })
})

describe("SearchComponent  ==> Test Status of Component", () => {
  let wrapperShadow
  beforeEach(() => {
    registerConfiguration()
    wrapperShadow = shallow(<SearchComponent />)
  })

  it(" SearchComponent:  should be empty state ", () => {
    config.set({}, {freeze: false})
    const localWrapperShadow = shallow(
      <SearchComponent
        renderNoSuggestion={() => null}
        renderError={"Thuis is a test error"}
      />
    )
    expect(localWrapperShadow.state()).toEqual({})
  })

  it("SearchComponent :  should  State must be not empty ", () => {
    expect(wrapperShadow.state()).toBeTruthy()
  })

  it(" SearchComponent:  should  change status  ", () => {
    wrapperShadow.setState({componentTest: "Test"})
    expect(wrapperShadow.state().componentTest).toEqual("Test")
  })

  it(" SearchComponent:  should  call function  onError and should return the same message ", () => {
    let errorMessage = "Test Error "
    const result = wrapperShadow.instance().onError(errorMessage)
    expect(result.props.children[4]).toEqual(errorMessage)
  })

  it(" SearchComponent:  should  call function  onNoSuggestion and should return No suggestions found ", () => {
    let onNoSuggestion = "No suggestions found"
    const result = wrapperShadow.instance().onNoSuggestion()
    expect(result.props.children).toEqual(onNoSuggestion)
  })
})
