import React from "react"
import {mount, shallow} from "../../../../setupFiles"
import Card from "../../../../components/resultComponent/card/Card"

const dataPropsPassing = {
  authors: [
    {firstname: "", familyname: "", orcid: " ", fullname: "Edmond Kacaj", gnd: " "},
    {
      firstname: "",
      familyname: "",
      orcid: " ",
      fullname: " Isaac Newton ",
      gnd: " ",
    },
    {
      firstname: "",
      familyname: "",
      orcid: " ",
      fullname: "Albert Einstein",
      gnd: " ",
    },
  ],
  license: "https://creativecommons.org/licenses/by-sa/4.0/",
  url: "http://test.com",
  thumbnailUrl: "http://testphotourl.com",
  name: "Document Test",
  description: "This is just a object for test",
  dateModifiedInternal: "2020-02-20T17:35:02.537Z",
  keywords: ["Simulation", "Finite", "Elemente", "Methode", "Topologieoptimierung"],
  inLanguage: "en",
}

describe("CardCompnent ==> Test UI  ", () => {
  let wrapperShadow
  beforeEach(() => {
    wrapperShadow = shallow(<Card {...dataPropsPassing} />)
  })

  it("CardCompnent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot()
  })

  it(" CardCompnent:  should  wraps content in a div with .card class", () => {
    expect(wrapperShadow.find(".card").length).toBe(1)
  })
})

describe("CardCompnent  ==> Test Props of Component", () => {
  let wrapperMount
  beforeEach(() => {
    wrapperMount = mount(<Card {...dataPropsPassing} />)
  })

  it(" CardCompnent:  should be not empty props ", () => {
    expect(wrapperMount.props()).toBeTruthy()
  })

  it("CardCompnent :  should be props same as Object ", () => {
    expect(wrapperMount.props()).toMatchObject(dataPropsPassing)
  })

  it("CardCompnent :  should be possibly to add props ", () => {
    wrapperMount.setProps({cardProp: "Test"})
    expect(wrapperMount.prop("cardProp")).toEqual("Test")
  })
})
