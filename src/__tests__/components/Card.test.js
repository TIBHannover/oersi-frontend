import React from "react"
import Card from "../../components/Card"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import {OersiConfigContext} from "../../helpers/use-context"
import {render, screen} from "@testing-library/react"
import {getTheme} from "../../Configuration"
import {ThemeProvider} from "@mui/material"
import {MemoryRouter} from "react-router-dom"
import userEvent from "@testing-library/user-event"

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
const mockNavigate = jest.fn()
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}))

describe("TileCard: Test UI", () => {
  const Config = (props) => {
    return (
      <MemoryRouter>
        <OersiConfigContext.Provider value={defaultConfig.GENERAL_CONFIGURATION}>
          <ThemeProvider theme={getTheme()}>{props.children}</ThemeProvider>
        </OersiConfigContext.Provider>
      </MemoryRouter>
    )
  }

  it("TileCard: should render without crashing", async () => {
    render(
      <Config>
        <Card {...fakeData} />
      </Config>
    )
  })

  it("TileCard: translate label of learningResourceType", () => {
    render(
      <Config>
        <Card {...fakeData} />
      </Config>
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
      <Config>
        <Card {...fakeMinimalData} />
      </Config>
    )
  })

  it("TileCard: minimal example should render", () => {
    const fakeMinimalData = {
      id: "https://axel-klinger.gitlab.io/gitlab-for-documents/index.html",
      name: "GitLab für Texte",
      _id: 123456,
    }
    render(
      <Config>
        <Card {...fakeMinimalData} />
      </Config>
    )
  })

  const testLicense = (license, expectedIconCount) => {
    let fakeDataLicense = Object.assign({}, fakeData)
    fakeDataLicense.license = {
      id: license,
    }
    const {container} = render(
      <Config>
        <Card {...fakeDataLicense} />
      </Config>
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
  it("TileCard: test license without icon", () => {
    let fakeDataLicense = Object.assign({}, fakeData)
    fakeDataLicense.license = {
      id: "https://opensource.org/licenses/MIT",
    }
    render(
      <Config>
        <Card {...fakeDataLicense} />
      </Config>
    )
    expect(screen.queryByRole("link", {name: "MIT"})).toBeInTheDocument()
  })

  it("TileCard: show details-button, if feature is activated", async () => {
    render(
      <Config>
        <Card {...fakeData} />
      </Config>
    )
    const button = screen.getByRole("button", {name: "LABEL.SHOW_DETAILS"})
    await userEvent.click(button)
    expect(mockNavigate).toBeCalled()
  })

  it("TileCard: illegal pseduo protocol", () => {
    let fakeModified = Object.assign({}, fakeData)
    // eslint-disable-next-line no-script-url
    fakeModified.id = "javascript:doSomething()"
    render(
      <Config>
        <Card {...fakeModified} />
      </Config>
    )
    const linkToMaterial = screen.getByRole("link", {name: "GitLab für Texte"})
    // eslint-disable-next-line no-script-url
    expect(linkToMaterial.href).not.toContain("javascript:doSomething()")
  })
})
