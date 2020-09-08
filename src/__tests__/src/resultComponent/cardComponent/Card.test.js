import React from "react"
import ReactDOM from "react-dom"
import Card from "../../../../components/resultComponent/card/Card"
import i18n from "i18next"
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
  GENERAL_CONFIGURATION: {
    LANGUAGE: "en",
  },
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
  ],
  name: "GitLab für Texte",
}

let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div")
  document.body.appendChild(container)
})

describe("CardComponent ==> Test UI  ", () => {
  it("CardComponent : should render without crashing", async () => {
    const div = document.createElement("div")
    ReactDOM.render(
      <ConfigurationRunTime.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <Card {...fakeData} />
      </ConfigurationRunTime.Provider>,
      div
    )

    ReactDOM.unmountComponentAtNode(div)
  })

  it("CardComponent : translate label of provider", () => {
    const div = document.createElement("div")
    ReactDOM.render(
      <ConfigurationRunTime.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <Card {...fakeData} />
      </ConfigurationRunTime.Provider>,
      div
    )
    const labelNodes = div.querySelectorAll(".MuiChip-label")
    const labels = Array.from(labelNodes.values()).map((e) => e.textContent)
    expect(labels).toContain("ZOERR")
    expect(labels).toContain("OERNDS")
    ReactDOM.unmountComponentAtNode(div)
  })

  it("CardComponent : translate label of learningResourceType", () => {
    const div = document.createElement("div")
    ReactDOM.render(
      <ConfigurationRunTime.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <Card {...fakeData} />
      </ConfigurationRunTime.Provider>,
      div
    )
    const labelNodes = div.querySelectorAll(".MuiChip-label")
    const labels = Array.from(labelNodes.values()).map((e) => e.textContent)
    expect(labels).toContain("Video")
    ReactDOM.unmountComponentAtNode(div)
  })

  it("CardComponent : format date by locale", () => {
    const div = document.createElement("div")
    ReactDOM.render(
      <ConfigurationRunTime.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <Card {...fakeData} />
      </ConfigurationRunTime.Provider>,
      div
    )
    const labelNodes = div.querySelectorAll(".MuiCardHeader-subheader")
    const labels = Array.from(labelNodes.values()).map((e) => e.textContent)
    expect(labels).toContain("Jul 9, 2020")
    ReactDOM.unmountComponentAtNode(div)
  })
})
