import React from "react"
import TileCard from "../../components/Card"
import i18n from "i18next"
import i18next from "i18next"
import {initReactI18next} from "react-i18next"
import {OersiConfigContext} from "../../helpers/use-context"
import {render, screen} from "@testing-library/react"

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  // have a common namespace used around the full app
  ns: ["translation"],
  defaultNS: "translation",
  resources: {
    en: {
      lrt: {
        "https://w3id.org/kim/hcrt/video": "Video",
      },
      language: {
        de: "German",
        en: "English",
      },
    },
    de: {
      language: {
        de: "Deutsch",
        en: "Englisch",
      },
    },
  },
})

const defaultConfig = {
  GENERAL_CONFIGURATION: {
    FEATURES: {},
  },
}
const fakeData = {
  about: [
    {
      id: "Test",
    },
  ],
  audience: [
    {
      id: "http://purl.org/dcx/lrmi-vocabs/educationalAudienceRole/teacher",
    },
  ],
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
  inLanguage: ["en"],
  learningResourceType: [
    {
      id: "https://w3id.org/kim/hcrt/video",
    },
  ],
  license: {
    id: "https://creativecommons.org/licenses/by/4.0/deed.de",
  },
  mainEntityOfPage: [
    {
      dateModified: "2020-07-09T06:13:48.000Z",
      provider: {
        type: null,
        name: "ZOERR",
        dateModified: null,
      },
      id: "https://uni-tuebingen.oerbw.de/edu-sharing/components/render/bd3a8bff-7973-4990-aed8-33a7cb9390f8",
    },
    {
      provider: {
        type: null,
        name: "OERNDS",
        dateModified: null,
      },
      id: "https://oernds.de/edu-sharing/components/render/bd3a8bff-7973-4990-aed8-33a7cb9390f8",
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
  keywords: ["OER", "Open Education Portal"],
}

describe("TileCard: Test UI", () => {
  it("TileCard: should render without crashing", async () => {
    render(
      <OersiConfigContext.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <TileCard {...fakeData} />
      </OersiConfigContext.Provider>
    )
  })

  it("TileCard: expanded card should render without crashing", async () => {
    render(
      <OersiConfigContext.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <TileCard expanded={true} {...fakeData} />
      </OersiConfigContext.Provider>
    )
  })

  it("TileCard: existing provider/source action", () => {
    render(
      <OersiConfigContext.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <TileCard expanded={true} {...fakeData} />
      </OersiConfigContext.Provider>
    )
    expect(screen.queryByRole("link", {name: "ZOERR"})).toBeInTheDocument()
    expect(screen.queryByRole("link", {name: "OERNDS"})).toBeInTheDocument()
  })

  it("TileCard: translate label of learningResourceType", () => {
    render(
      <OersiConfigContext.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <TileCard expanded={true} {...fakeData} />
      </OersiConfigContext.Provider>
    )
    expect(screen.queryByText("Video")).toBeInTheDocument()
  })

  it("TileCard: null fields and empty lists should render", () => {
    const fakeMinimalData = {
      about: [],
      creator: [],
      id: "https://axel-klinger.gitlab.io/gitlab-for-documents/index.html",
      mainEntityOfPage: [],
      name: "GitLab für Texte",
      _id: 123456,
      sourceOrganization: [],
      keywords: [],
    }
    render(
      <OersiConfigContext.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <TileCard expanded={true} {...fakeMinimalData} />
      </OersiConfigContext.Provider>
    )
  })

  it("TileCard: minimal example should render", () => {
    const fakeMinimalData = {
      id: "https://axel-klinger.gitlab.io/gitlab-for-documents/index.html",
      name: "GitLab für Texte",
      _id: 123456,
    }
    render(
      <OersiConfigContext.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <TileCard {...fakeMinimalData} />
      </OersiConfigContext.Provider>
    )
  })

  const testLicense = (license, expectedIconCount) => {
    let fakeDataLicense = Object.assign({}, fakeData)
    fakeDataLicense.license = {
      id: license,
    }
    const {container} = render(
      <OersiConfigContext.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <TileCard {...fakeDataLicense} />
      </OersiConfigContext.Provider>
    )
    const labelNodes = Array.from(
      container.querySelectorAll(".card-action-license svg")
    )
    expect(labelNodes).toHaveLength(expectedIconCount)
  }

  it("TileCard: test CC-BY license", () => {
    testLicense("https://creativecommons.org/licenses/by/4.0/deed.de", 2)
  })
  it("TileCard: test CC-BY-NC license", () => {
    testLicense("https://creativecommons.org/licenses/by-nc/4.0", 3)
  })
  it("TileCard: test CC-BY-NC-ND license", () => {
    testLicense("https://creativecommons.org/licenses/by-nc-nd/4.0", 4)
  })
  it("TileCard: test CC-BY-NC-SA license", () => {
    testLicense("https://creativecommons.org/licenses/by-nc-sa/4.0", 4)
  })
  it("TileCard: test CC-BY-ND license", () => {
    testLicense("https://creativecommons.org/licenses/by-nd/4.0", 3)
  })
  it("TileCard: test CC-BY-SA license", () => {
    testLicense("https://creativecommons.org/licenses/by-sa/4.0/", 3)
  })
  it("TileCard: test CC-ZERO license", () => {
    testLicense("https://creativecommons.org/publicdomain/zero/1.0/", 2)
  })
  it("TileCard: test PDM license", () => {
    testLicense("https://creativecommons.org/publicdomain/mark/1.0/", 1)
  })
  it("TileCard: unknown license structure", () => {
    testLicense("https://some.org/lic/unknown", 1)
  })
  it("TileCard: no icon if no provided license", () => {
    testLicense("", 0)
  })

  it("TileCard: organization must be 'Hochschule Reutlingen' ", () => {
    render(
      <OersiConfigContext.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <TileCard expanded={true} {...fakeData} />
      </OersiConfigContext.Provider>
    )
    expect(screen.queryByText("Hochschule Reutlingen")).toBeInTheDocument()
  })

  it("TileCard: organization must be empty ", () => {
    let fakeEmptyOrganization = Object.assign({}, fakeData)
    fakeEmptyOrganization.sourceOrganization = []
    render(
      <OersiConfigContext.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <TileCard expanded={true} {...fakeEmptyOrganization} />
      </OersiConfigContext.Provider>
    )
    expect(screen.queryByText("Hochschule Reutlingen")).not.toBeInTheDocument()
  })

  it("TileCard: hide author, if empty", () => {
    let fakeEmptyCreator = Object.assign({}, fakeData)
    fakeEmptyCreator.creator = []
    render(
      <OersiConfigContext.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <TileCard expanded={true} {...fakeEmptyCreator} />
      </OersiConfigContext.Provider>
    )
    expect(screen.queryByLabelText("author")).not.toBeInTheDocument()
  })

  it("TileCard: translate Language in English expect 'English' ", () => {
    render(
      <OersiConfigContext.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <TileCard expanded={true} {...fakeData} />
      </OersiConfigContext.Provider>
    )
    const lngNode = screen.getByLabelText("language")
    expect(lngNode.textContent).toBe("English")
  })

  it("TileCard: translate Language code for 'null' label", () => {
    render(
      <OersiConfigContext.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <TileCard expanded={true} {...fakeData} inLanguage={null} />
      </OersiConfigContext.Provider>
    )
    const lngNode = screen.queryByLabelText("language")
    expect(lngNode).not.toBeInTheDocument()
  })

  it("TileCard: translate Language in German expect 'Englisch' ", () => {
    i18next.changeLanguage("de")
    render(
      <OersiConfigContext.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <TileCard expanded={true} {...fakeData} />
      </OersiConfigContext.Provider>
    )
    const lngNode = screen.getByLabelText("language")
    expect(lngNode.textContent).toBe("Englisch")
  })

  it("TileCard: should have a link for JSON ", () => {
    render(
      <OersiConfigContext.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <TileCard expanded={true} {...fakeData} />
      </OersiConfigContext.Provider>
    )
    const node = screen.getByRole("link", {name: "link to json-ld"})
    expect(node.href).toContain("http://localhost/" + fakeData._id + "?format=json")
  })

  it("TileCard: keywords must not be empty, must have OER ", () => {
    render(
      <OersiConfigContext.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <TileCard expanded={true} {...fakeData} />
      </OersiConfigContext.Provider>
    )
    expect(screen.queryByText(fakeData.keywords[0])).toBeInTheDocument()
  })

  it("TileCard: no last date modified", () => {
    let fakeModified = Object.assign({}, fakeData)
    fakeModified.mainEntityOfPage = [
      {
        id: "https://uni-tuebingen.oerbw.de/edu-sharing/components/render/bd3a8bff-7973-4990-aed8-33a7cb9390f8",
      },
      {
        id: "https://oernds.de/edu-sharing/components/render/bd3a8bff-7973-4990-aed8-33a7cb9390f8",
      },
    ]
    render(
      <OersiConfigContext.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <TileCard expanded={true} {...fakeModified} />
      </OersiConfigContext.Provider>
    )
    expect(screen.queryByLabelText("lastModified")).not.toBeInTheDocument()
  })
  it("TileCard: max last date modified", () => {
    let fakeModified = Object.assign({}, fakeData)
    fakeModified.mainEntityOfPage = [
      {
        dateModified: "2020-07-09T00:00:00.000Z",
      },
      {
        dateModified: "2020-08-09T00:00:00.000Z",
      },
    ]
    render(
      <OersiConfigContext.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <TileCard expanded={true} {...fakeModified} />
      </OersiConfigContext.Provider>
    )
    const node = screen.getByLabelText("lastModified")
    expect(node.textContent).toContain("9. Aug. 2020")
  })

  const getFeatureConfig = (features) => {
    let configModified = Object.assign({}, defaultConfig.GENERAL_CONFIGURATION)
    configModified.FEATURES = features
    return configModified
  }
  it("TileCard: no embed-button, if feature is deactivated", () => {
    render(
      <OersiConfigContext.Provider value={getFeatureConfig({EMBED_OER: false})}>
        <TileCard {...fakeData} />
      </OersiConfigContext.Provider>
    )
    expect(
      screen.queryByRole("button", {name: "EMBED_MATERIAL.EMBED"})
    ).not.toBeInTheDocument()
  })
  it("TileCard: show embed-button, if feature is activated", () => {
    render(
      <OersiConfigContext.Provider value={getFeatureConfig({EMBED_OER: true})}>
        <TileCard {...fakeData} />
      </OersiConfigContext.Provider>
    )
    expect(
      screen.queryByRole("button", {name: "EMBED_MATERIAL.EMBED"})
    ).toBeInTheDocument()
  })
  it("TileCard: no embed-button, if oer is not embedable", () => {
    let fakeModified = Object.assign({}, fakeData)
    fakeModified.creator = []
    render(
      <OersiConfigContext.Provider value={getFeatureConfig({EMBED_OER: true})}>
        <TileCard {...fakeModified} />
      </OersiConfigContext.Provider>
    )
    expect(
      screen.queryByRole("button", {name: "EMBED_MATERIAL.EMBED"})
    ).not.toBeInTheDocument()
  })
  it("TileCard: show details-button, if feature is activated", () => {
    render(
      <OersiConfigContext.Provider
        value={getFeatureConfig({USE_RESOURCE_PAGE: true})}
      >
        <TileCard {...fakeData} />
      </OersiConfigContext.Provider>
    )
    expect(
      screen.queryByRole("link", {name: "LABEL.SHOW_DETAILS"})
    ).toBeInTheDocument()
  })

  it("TileCard: illegal pseduo protocol", () => {
    let fakeModified = Object.assign({}, fakeData)
    // eslint-disable-next-line no-script-url
    fakeModified.id = "javascript:doSomething()"
    render(
      <OersiConfigContext.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
        <TileCard expanded={true} {...fakeModified} />
      </OersiConfigContext.Provider>
    )
    const linkToMaterial = screen.getByRole("link", {name: "GitLab für Texte"})
    // eslint-disable-next-line no-script-url
    expect(linkToMaterial.href).not.toContain("javascript:doSomething()")
  })
})
