import React from "react"
import ReactDOM from "react-dom"
import Card from "../../../../components/resultComponent/card/Card"
import i18n from "i18next"
import i18next from "i18next"
import {initReactI18next} from "react-i18next"
import {ConfigurationRunTime} from "../../../../helpers/use-context"

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  // have a common namespace used around the full app
  ns: ["provider"],
  defaultNS: "provider",
  resources: {
    en: {
      provider: {
        "uni-tuebingen.oerbw.de": "ZOERR",
      },
      lrt: {
        "https://w3id.org/kim/hcrt/video": "Video",
      },
    },
  },
})

const defaultConfig = {
  GENERAL_CONFIGURATION: {},
}
const fakeData = {
  about: [
    {
      id: "Test",
    },
  ],
  audience: {
    id: "Test",
  },
  creator: [
    {
      id: null,
      name: "Max Mustermann",
      type: "Person",
    },
  ],
  dateCreated: "2020-02-22",
  datePublished: "2020-02-22",
  description: "an example description",
  id: "https://axel-klinger.gitlab.io/gitlab-for-documents/index.html",
  image:
    "https://www.oernds.de/edu-sharing/preview?nodeId=84400a83-9d1a-4738-a19f-00fc332df247&storeProtocol=workspace&storeId=SpacesStore&dontcache=1589890988103",
  inLanguage: "en",
  learningResourceType: {
    id: "https://w3id.org/kim/hcrt/video",
  },
  license: "https://creativecommons.org/licenses/by/4.0/deed.de",
  mainEntityOfPage: [
    {
      dateModified: "2020-07-09T06:13:48.000Z",
      provider: {
        type: null,
        name: "uni-tuebingen.oerbw.de",
        dateModified: null,
      },
      id:
        "https://uni-tuebingen.oerbw.de/edu-sharing/components/render/bd3a8bff-7973-4990-aed8-33a7cb9390f8",
    },
    {
      provider: {
        type: null,
        name: "OERNDS",
        dateModified: null,
      },
      id:
        "https://oernds.de/edu-sharing/components/render/bd3a8bff-7973-4990-aed8-33a7cb9390f8",
    },
    {},
  ],
  name: "GitLab für Texte",
  _id: 123456,
  sourceOrganization: [
    {
      name: "Hochschule Reutlingen",
      id: null,
      type: "Organization",
    },
  ],
}

let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div")
  document.body.appendChild(container)
})
describe("CardComponent ==> Test UI  ", () => {
  it("CardComponent : should render without crashing", async () => {
    ReactDOM.render(
      <ConfigurationRunTime.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <Card {...fakeData} />
      </ConfigurationRunTime.Provider>,
      container
    )
  })

  it("CardComponent : translate label of provider", () => {
    ReactDOM.render(
      <ConfigurationRunTime.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <Card {...fakeData} />
      </ConfigurationRunTime.Provider>,
      container
    )
    const labelNodes = container.querySelectorAll(".MuiChip-label")
    const labels = Array.from(labelNodes.values()).map((e) => e.textContent)
    expect(labels).toContain("ZOERR")
    expect(labels).toContain("OERNDS")
  })

  it("CardComponent : translate label of learningResourceType", () => {
    ReactDOM.render(
      <ConfigurationRunTime.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <Card {...fakeData} />
      </ConfigurationRunTime.Provider>,
      container
    )
    const labelNodes = container.querySelectorAll(".MuiChip-label")
    const labels = Array.from(labelNodes.values()).map((e) => e.textContent)
    expect(labels).toContain("Video")
  })

  it("CardComponent : format date by locale", () => {
    ReactDOM.render(
      <ConfigurationRunTime.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <Card {...fakeData} />
      </ConfigurationRunTime.Provider>,
      container
    )
    const labelNodes = container.querySelectorAll(".MuiCardHeader-subheader")
    const labels = Array.from(labelNodes.values()).map((e) => e.textContent)
    expect(labels).toContain("Jul 9, 2020")
  })

  it("CardComponent : license  must be empty ", () => {
    let fakeEmptyLicense = Object.assign({}, fakeData)
    fakeEmptyLicense.license = ""
    ReactDOM.render(
      <ConfigurationRunTime.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <Card {...fakeEmptyLicense} />
      </ConfigurationRunTime.Provider>,
      container
    )
    const labelNodes = container.querySelectorAll(
      ".card-card-license img:nth-child(2)"
    )[0].src
    expect(labelNodes.substr(labelNodes.length - 7)).not.toEqual("4.0.svg")

    ReactDOM.unmountComponentAtNode(container)
  })

  it("CardComponent : license license must be 4.0.svg ", () => {
    ReactDOM.render(
      <ConfigurationRunTime.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <Card {...fakeData} />
      </ConfigurationRunTime.Provider>,
      container
    )
    const labelNodes = container.querySelectorAll(
      ".card-card-license img:nth-child(2)"
    )[0].src
    expect(labelNodes.substr(labelNodes.length - 7)).toEqual("4.0.svg")
  })

  it("CardComponent : organization must not be 'Hochschule Reutlingen' ", () => {
    ReactDOM.render(
      <ConfigurationRunTime.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <Card {...fakeData} />
      </ConfigurationRunTime.Provider>,
      container
    )
    const labelNodes = container.querySelectorAll(".card-card-organization")
    const labels = Array.from(labelNodes.values())
      .map((e) => e.textContent)[0]
      .split(":")
    expect(labels[1]).toContain("Hochschule Reutlingen")
  })

  it("CardComponent : organization must be empty ", () => {
    let fakeEmptyOrganization = Object.assign({}, fakeData)
    fakeEmptyOrganization.sourceOrganization = []
    ReactDOM.render(
      <ConfigurationRunTime.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <Card {...fakeEmptyOrganization} />
      </ConfigurationRunTime.Provider>,
      container
    )
    const labelNodes = container.querySelectorAll(".card-card-organization")
    const labels = Array.from(labelNodes.values()).map((e) => e.textContent)[0]
    console.log(labels)
    expect(labels).toContain([""])
  })

  it("CardComponent : translate Language in English expect 'English' ", () => {
    const div = document.createElement("div")
    ReactDOM.render(
      <ConfigurationRunTime.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <Card {...fakeData} />
      </ConfigurationRunTime.Provider>,
      div
    )
    const labelNodes = div.querySelectorAll(".MuiChip-label")
    const labels = Array.from(labelNodes.values()).map((e) => e.textContent)[1]
    expect(labels).toContain("English")
    ReactDOM.unmountComponentAtNode(div)
  })

  it("CardComponent : translate Language in German expect 'Englisch' ", () => {
    i18next.changeLanguage("de")
    const div = document.createElement("div")
    ReactDOM.render(
      <ConfigurationRunTime.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <Card {...fakeData} />
      </ConfigurationRunTime.Provider>,
      div
    )
    const labelNodes = div.querySelectorAll(".MuiChip-label")
    const labels = Array.from(labelNodes.values()).map((e) => e.textContent)[1]
    expect(labels).toContain("Englisch")
    ReactDOM.unmountComponentAtNode(div)
  })

  it("CardComponent : should have a link for JSON ", () => {
    const div = document.createElement("div")
    ReactDOM.render(
      <ConfigurationRunTime.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <Card {...fakeData} />
      </ConfigurationRunTime.Provider>,
      div
    )
    const labelNodes = div.querySelectorAll(".card-card-chip-jsonLink")
    const labels = Array.from(labelNodes).map((e) => e.href)[0]
    expect(labels).toContain("http://localhost/" + fakeData._id)
    ReactDOM.unmountComponentAtNode(div)
  })
})
