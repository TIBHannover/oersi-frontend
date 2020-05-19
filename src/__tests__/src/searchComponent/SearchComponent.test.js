import React from "react"
import {shallow} from "../../../setupFiles"
import SearchComponent from "../../../components/searchComponent/SearchComponent"
import config from "react-global-configuration"
import prod from "../../../config/prod"
import {DataSearch} from "@appbaseio/reactivesearch"

describe("SearchComponent ==> Test UI  ", () => {
  let wrapperShadow
  beforeEach(() => {
    config.set(prod, {freeze: false})
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
    config.set(prod, {freeze: false})
    wrapperShadow = shallow(<SearchComponent />)
  })

  it(" SearchComponent:  should be empty state ", () => {
    config.set({}, {freeze: false})
    const localWrapperShadow = shallow(<SearchComponent />)
    expect(localWrapperShadow.state()).toEqual({})
  })

  it("SearchComponent :  should  State must be not empty ", () => {
    expect(wrapperShadow.state()).toBeTruthy()
  })

  it(" SearchComponent:  should  change status  ", () => {
    wrapperShadow.setState({componentTest: "Test"})
    expect(wrapperShadow.state().componentTest).toEqual("Test")
  })
})
