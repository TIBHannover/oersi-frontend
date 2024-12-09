import React from "react"
import Card from "../../components/Card"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import {SearchIndexFrontendConfigContext} from "../../helpers/use-context"
import {fireEvent, render, screen} from "@testing-library/react"
import {getTheme} from "../../Configuration"
import {ThemeProvider} from "@mui/material"
import {MemoryRouter} from "react-router"
import userEvent from "@testing-library/user-event"
import {defaultLicenseGrouping} from "../helpers/test-helpers"

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  // have a common namespace used around the full app
  ns: ["translation"],
  defaultNS: "translation",
  resources: {
    en: {
      labelledConcept: {
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
    fieldConfiguration: {
      baseFields: {
        title: "name",
        resourceLink: "id",
        licenseUrl: "license.id",
        author: "creator.name",
        thumbnailUrl: "image",
      },
      options: [
        {
          dataField: "about.id",
          translationNamespace: "labelledConcept",
        },
        {
          dataField: "audience.id",
          translationNamespace: "labelledConcept",
        },
        {
          dataField: "inLanguage",
          translationNamespace: "language",
        },
        {
          dataField: "learningResourceType.id",
          translationNamespace: "labelledConcept",
        },
        {
          dataField: "license.id",
          defaultDisplayType: "licenseGroup",
          grouping: defaultLicenseGrouping,
          collectOthersInSeparateGroup: true,
        },
      ],
    },
    resultCard: {
      title: {},
      subtitle: {field: "creator.name"},
      content: [
        {
          field: "description",
          maxLines: 4,
          bold: true,
          fallback: ["keywords"],
        },
        {field: "about.id"},
        {field: "learningResourceType.id"},
      ],
    },
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
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}))
jest.mock("react-lazyload", () => ({
  __esModule: true,
  default: ({children}) => <div data-testid="LazyLoad">{children}</div>,
}))

describe("TileCard: Test UI", () => {
  const Config = (props) => {
    return (
      <MemoryRouter>
        <SearchIndexFrontendConfigContext.Provider
          value={props.config ? props.config : defaultConfig.GENERAL_CONFIGURATION}
        >
          <ThemeProvider theme={getTheme()}>{props.children}</ThemeProvider>
        </SearchIndexFrontendConfigContext.Provider>
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

  it("TileCard: show keywords if no description available", () => {
    const fakeMinimalData = {
      id: "https://axel-klinger.gitlab.io/gitlab-for-documents/index.html",
      name: "GitLab für Texte",
      _id: 123456,
      keywords: ["OER", "Open Education Portal"],
    }
    render(
      <Config>
        <Card {...fakeMinimalData} />
      </Config>
    )
    const desc = screen.getByText("OER, Open Education Portal")
    expect(desc).toHaveTextContent("OER, Open Education Portal")
  })

  const testLicense = (license, expectedItemCount, isIcon = true, config = null) => {
    let fakeDataLicense = Object.assign({}, fakeData)
    fakeDataLicense.license = {
      id: license,
    }
    const {container} = render(
      <Config config={config ? {...config} : null}>
        <Card {...fakeDataLicense} />
      </Config>
    )
    const labelNodes = Array.from(
      container.querySelectorAll(".card-action-license" + isIcon ? " svg" : "")
    )
    expect(labelNodes).toHaveLength(expectedItemCount)
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
  it("TileCard: unknown license structure in OTHER group", () => {
    testLicense("https://some.org/lic/unknown", 0, false)
  })
  it("TileCard: unknown license structure without OTHER group", () => {
    testLicense("https://some.org/lic/unknown", 1, false, {
      ...defaultConfig.GENERAL_CONFIGURATION,
      fieldConfiguration: {
        baseFields: {
          title: "name",
          resourceLink: "id",
          licenseUrl: "license.id",
          author: "creator.name",
        },
        options: [
          {
            dataField: "license.id",
            defaultDisplayType: "licenseGroup",
            grouping: defaultLicenseGrouping,
            collectOthersInSeparateGroup: false,
          },
        ],
      },
    })
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
    expect(screen.getByRole("link", {name: "mit"})).toBeInTheDocument()
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

  it("TileCard: illegal pseudo protocol", () => {
    let fakeModified = Object.assign({}, fakeData)
    // eslint-disable-next-line no-script-url
    fakeModified.id = "javascript:doSomething()"
    render(
      <Config>
        <Card {...fakeModified} />
      </Config>
    )
    const linkToMaterial = screen.getByLabelText("GitLab für Texte")
    // eslint-disable-next-line no-script-url
    expect(linkToMaterial.href).not.toContain("javascript:doSomething()")
  })

  it("TileCard: use SIDRE thumbnail, if feature is activated", async () => {
    render(
      <Config
        config={{
          ...defaultConfig.GENERAL_CONFIGURATION,
          FEATURES: {SIDRE_THUMBNAILS: true},
        }}
      >
        <Card {...fakeData} />
      </Config>
    )
    const image = screen.getByRole("img", {name: "resource image"})
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", "/thumbnail/" + fakeData._id + ".webp")
    fireEvent.error(image)
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", fakeData.image)
    fireEvent.error(image)
    expect(image).not.toBeInTheDocument()
  })

  it("Render card without subtitle", () => {
    render(
      <Config
        config={{
          ...defaultConfig.GENERAL_CONFIGURATION,
          resultCard: {
            content: [{field: "description"}],
          },
        }}
      >
        <Card {...fakeData} />
      </Config>
    )
    const desc = screen.getByText("GitLab für Texte")
    expect(desc).toHaveTextContent("GitLab für Texte")
  })

  it("Card: show multilingual title", () => {
    let fakeModified = Object.assign({}, fakeData)
    fakeModified.name = {de: "Test de", en: "Test en"}
    render(
      <Config
        config={{
          ...defaultConfig.GENERAL_CONFIGURATION,
          fieldConfiguration: {
            baseFields: {
              title: "name",
              resourceLink: "id",
              licenseUrl: "license.id",
              author: "creator.name",
              thumbnailUrl: "image",
            },
            options: [
              {
                dataField: "name",
                multilingual: {
                  languageSelectionType: "map",
                },
              },
            ],
          },
        }}
      >
        <Card {...fakeModified} />
      </Config>
    )
    const desc = screen.getByText("Test en")
    expect(desc).toHaveTextContent("Test en")
  })

  it("Card: show multilingual title for field language selection", () => {
    let fakeModified = Object.assign({}, fakeData)
    fakeModified.name = [
      {language: "de", value: "Test de"},
      {language: "en", value: "Test en"},
    ]
    render(
      <Config
        config={{
          ...defaultConfig.GENERAL_CONFIGURATION,
          fieldConfiguration: {
            baseFields: {
              title: "name",
              resourceLink: "id",
              licenseUrl: "license.id",
              author: "creator.name",
              thumbnailUrl: "image",
            },
            options: [
              {
                dataField: "name",
                multilingual: {
                  languageSelectionType: "field",
                  languageSelectionField: "language",
                  valueField: "value",
                },
              },
            ],
          },
        }}
      >
        <Card {...fakeModified} />
      </Config>
    )
    const desc = screen.getByText("Test en")
    expect(desc).toHaveTextContent("Test en")
  })

  it("Card: show minimal data if no multilingual description available", () => {
    const fakeMinimalData = {
      id: "https://axel-klinger.gitlab.io/gitlab-for-documents/index.html",
      name: "Test en",
      _id: 123456,
    }
    render(
      <Config
        config={{
          ...defaultConfig.GENERAL_CONFIGURATION,
          fieldConfiguration: {
            baseFields: {
              title: "name",
              resourceLink: "id",
              licenseUrl: "license.id",
              author: "creator.name",
              thumbnailUrl: "image",
            },
            options: [
              {
                dataField: "description",
                multilingual: {
                  languageSelectionType: "field",
                  languageSelectionField: "language",
                  valueField: "value",
                },
              },
            ],
          },
        }}
      >
        <Card {...fakeMinimalData} />
      </Config>
    )
    const desc = screen.getByText("Test en")
    expect(desc).toHaveTextContent("Test en")
  })
})
