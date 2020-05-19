import React from "react"
import {shallow} from "../../../setupFiles"
import MultiListComponent from "../../../components/multiListComponent/MultiListComponent"
import {MultiList} from "@appbaseio/reactivesearch"

const configDataMultilist = {
  component: "AuthorFilter",
  dataField: "author.keyword",
  title: "Filter by Author",
  placeholder: "Filter Author",
  filterLabel: "Filter Author",
  showFilter: true,
  and: [
    "AuthorFilter",
    "LicenseFilter",
    "Search",
    "sourceFilter",
    "learningresourcetypeFilter",
    "inlanguageFilter",
  ],
}

describe("MultiListComponent ==> Test UI  ", () => {
  let wrapperShadow
  beforeEach(() => {
    wrapperShadow = shallow(<MultiListComponent />)
  })

  it("MultiListComponent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })

  it(" MultiListComponent:  should  wraps content in a div with .card class", () => {
    expect(wrapperShadow.find(".card").length).toBe(1)
  })

  it(" MultiListComponent:  should  wraps content in a div with .content class", () => {
    expect(wrapperShadow.find(".content").length).toBe(1)
  })

  it(" MultiListComponent:  should  wraps content in a div with MultiList Compoennt class", () => {
    expect(wrapperShadow.find(MultiList).length).toBe(1)
  })
})

describe("MultiListComponent  ==> Test Props of Component", () => {
  let wrapperShadow
  beforeEach(() => {
    wrapperShadow = shallow(<MultiListComponent {...configDataMultilist} />)
  })

  it(" MultiListComponent:  should be not empty props ", () => {
    expect(wrapperShadow.props().children.props.children.props).toBeTruthy()
  })
  it(" MultiListComponent:  call the function with License param", () => {
    const result = wrapperShadow
      .instance()
      .onLicenceRender("by-sa/4.0/", 40, "License")
    expect(result).not.toBeNull()
  })
  it(" MultiListComponent:  call the function with LicenseFilter param ", () => {
    const result = wrapperShadow
      .instance()
      .onLicenceRender("by-sa/4.0/", 30, "LicenseFilter")
    expect(result).not.toBeNull()
  })
  it("MultiListComponent :  should be props same as Object ConfigDataMultilist ", () => {
    let objectMatch = {
      dataField: "author.keyword",
      title: "Filter by Author",
      componentId: "AuthorFilter",
      placeholder: "Filter Author",
      showFilter: true,
      filterLabel: "Filter Author",
      react: {
        and: [
          "AuthorFilter",
          "LicenseFilter",
          "Search",
          "sourceFilter",
          "learningresourcetypeFilter",
          "inlanguageFilter",
        ],
      },
    }

    expect(wrapperShadow.props().children.props.children.props).toMatchObject(
      objectMatch
    )
  })
})
