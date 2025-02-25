import React from "react"
import {SearchIndexFrontendConfigContext} from "../../helpers/use-context"
import ResourceDetails from "../../views/ResourceDetails"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"
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
        "http://purl.org/dcx/lrmi-vocabs/educationalAudienceRole/teacher": "Teacher",
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
        },
      ],
    },
    detailPage: {
      content: [
        {field: "publisher.name"},
        {field: "creator.name"},
        {field: "learningResourceType.id"},
        {field: "description"},
        {field: "about.id"},
        {field: "sourceOrganization.name"},
        {
          field: "datePublished",
          type: "date", // license, rating, chips, text
        },
        {field: "inLanguage"},
        {
          field: "keywords",
          type: "chips", // license, rating, chips, text
        },
        {
          field: "aggregateRating.ratingCount",
          type: "rating",
        },
        {
          field: "license.id",
          type: "license", // license, rating, chips, text
        },
        {field: "audience.id"},
        {
          field: "hasVersion.name",
          externalLinkField: "hasVersion.id",
          type: "link",
        },
        {
          field: "mainEntityOfPage.provider.name",
          externalLinkField: "mainEntityOfPage.id",
          type: "link", // license, rating, chips, text
        },
        {
          field: "encoding.contentUrl",
          formatField: "encoding.encodingFormat",
          sizeField: "encoding.contentSize",
          type: "fileLink", // experimental
        },
        {
          field: "hasPart",
          type: "nestedObjects",
          content: [
            {field: "name"},
            {field: "description"},
            {field: "id", type: "link", externalLinkField: "id"},
            {
              field: "citation",
              type: "nestedObjects",
              content: [{field: "name"}],
            },
          ],
        },
      ],
    },
  },
}
const testRecord = {
  about: [
    {
      id: "https://w3id.org/kim/hochschulfaechersystematik/n105",
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
  id: "https://oer-test.com/some-resource/index.html",
  image: "https://oer-test.com/some-resource/image.png",
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
        name: "TESTPROVIDER",
      },
      id: "https://some-provider.de/990-aed8-33a7cb9390f8",
    },
    {
      dateModified: "2020-01-09T06:13:48.000Z",
      provider: {
        name: "TESTPROVIDER2",
      },
      id: "https://another.provider.de/sdafgsd354",
    },
  ],
  name: "TestTitle",
  sourceOrganization: [
    {
      name: "Hochschule Testorga",
      type: "Organization",
    },
  ],
  keywords: ["OER", "Open Education Portal"],
  encoding: [
    {embedUrl: "https://embed.url.org"},
    {contentUrl: "https://content.url.org/first"},
    {
      contentUrl: "https://content.url.org/second",
      encodingFormat: "application/pdf",
      contentSize: 12345,
    },
  ],
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

describe("ResourceDetails tests", () => {
  const testWithFakeData = (fakeData, ok = true, statusCode, statusText) => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: ok,
        status: statusCode,
        statusText: statusText,
        json: () => Promise.resolve(fakeData),
      })
    )
  }
  const ResourceDetailsWithConfig = (props) => {
    return (
      <MemoryRouter>
        <SearchIndexFrontendConfigContext.Provider
          value={props.config ? props.config : defaultConfig.GENERAL_CONFIGURATION}
        >
          <ThemeProvider theme={getTheme()}>
            <ResourceDetails match={{params: {resourceId: "id"}}} />
          </ThemeProvider>
        </SearchIndexFrontendConfigContext.Provider>
      </MemoryRouter>
    )
  }

  it("render ResourceDetails minimal example", async () => {
    const fakeData = {
      id: "https://oer-test.com/some-resource/index.html",
      name: "TestTitle",
    }
    testWithFakeData(fakeData)
    render(<ResourceDetailsWithConfig />)
    const titleNode = await screen.findByRole("heading", {name: fakeData.name})
    expect(titleNode).toBeInTheDocument()
    global.fetch.mockRestore()
  })

  it("render ResourceDetails", async () => {
    testWithFakeData(testRecord)
    render(<ResourceDetailsWithConfig />)
    const titleNode = await screen.findByRole("heading", {name: testRecord.name})
    expect(titleNode).toBeInTheDocument()
    global.fetch.mockRestore()
  })

  it("invalid response from backend", async () => {
    const fakeData = "invalid"
    testWithFakeData(fakeData)
    render(<ResourceDetailsWithConfig />)
    const errorNode = await screen.findByLabelText("error-message")
    expect(errorNode).toBeInTheDocument()
    global.fetch.mockRestore()
  })

  it("non ok response", async () => {
    const fakeData = {}
    testWithFakeData(fakeData, false, 404)
    render(<ResourceDetailsWithConfig />)
    const errorNode = await screen.findByLabelText("error-message")
    expect(errorNode).toBeInTheDocument()
    global.fetch.mockRestore()
  })

  it("non ok response with status text", async () => {
    const fakeData = {}
    testWithFakeData(fakeData, false, 404, "Not found")
    render(<ResourceDetailsWithConfig />)
    const errorNode = await screen.findByLabelText("error-message")
    expect(errorNode).toBeInTheDocument()
    global.fetch.mockRestore()
  })

  const getFeatureConfig = (features) => {
    let configModified = Object.assign({}, defaultConfig.GENERAL_CONFIGURATION)
    configModified.FEATURES = features
    return configModified
  }
  it("show embed-button, if feature is activated", async () => {
    testWithFakeData(testRecord)
    render(
      <ResourceDetailsWithConfig
        config={getFeatureConfig({RESOURCE_EMBEDDING_SNIPPET: true})}
      />
    )
    await screen.findByRole("heading", {name: testRecord.name})
    const embedNode = screen.queryByRole("button", {
      name: "EMBED_MATERIAL.EMBED",
    })
    expect(embedNode).toBeInTheDocument()
  })
  it("no embed-button, if feature is deactivated", async () => {
    testWithFakeData(testRecord)
    render(
      <ResourceDetailsWithConfig
        config={getFeatureConfig({RESOURCE_EMBEDDING_SNIPPET: false})}
      />
    )
    await screen.findByRole("heading", {name: testRecord.name})
    const embedNode = screen.queryByRole("button", {
      name: "EMBED_MATERIAL.EMBED",
    })
    expect(embedNode).not.toBeInTheDocument()
  })
  it("no embed-button, if oer is not embedable", async () => {
    let fakeModified = Object.assign({}, testRecord)
    fakeModified.creator = []
    testWithFakeData(fakeModified)
    render(
      <ResourceDetailsWithConfig
        config={getFeatureConfig({RESOURCE_EMBEDDING_SNIPPET: true})}
      />
    )
    await screen.findByRole("heading", {name: testRecord.name})
    const embedNode = screen.queryByRole("button", {
      name: "EMBED_MATERIAL.EMBED",
    })
    expect(embedNode).not.toBeInTheDocument()
  })
  it("click report record button", async () => {
    testWithFakeData(testRecord)
    render(
      <ResourceDetailsWithConfig
        config={getFeatureConfig({RESOURCE_EMBEDDING_SNIPPET: true})}
      />
    )
    await screen.findByRole("heading", {name: testRecord.name})
    const reportButton = screen.getByRole("button", {
      name: "CONTACT.TOPIC_REPORT_RECORD",
    })
    await userEvent.click(reportButton)
    expect(mockNavigate).toBeCalled()
  })

  it("render ResourceDetails with non-icon-license", async () => {
    testWithFakeData({
      ...testRecord,
      license: {id: "https://opensource.org/licenses/MIT"},
    })
    render(<ResourceDetailsWithConfig />)
    const titleNode = await screen.findByLabelText("MIT")
    expect(titleNode).toBeInTheDocument()
    global.fetch.mockRestore()
  })

  it("test SIDRE thumbnail, if activated", async () => {
    testWithFakeData(testRecord)
    render(
      <ResourceDetailsWithConfig
        config={getFeatureConfig({SIDRE_THUMBNAILS: true})}
      />
    )
    const image = await screen.findByAltText("fallback workaround")
    expect(image).toHaveAttribute(
      "src",
      expect.stringMatching(/\/thumbnail\/.*\.webp/)
    )
  })

  it("test SIDRE thumbnail for non-embeddable mat", async () => {
    testWithFakeData({
      ...testRecord,
      license: {},
    })
    render(
      <ResourceDetailsWithConfig
        config={getFeatureConfig({SIDRE_THUMBNAILS: true})}
      />
    )
    const image = await screen.findByAltText("preview image")
    expect(image).toHaveAttribute(
      "src",
      expect.stringMatching(/\/thumbnail\/.*\.webp/)
    )
    fireEvent.error(image)
    expect(image).toHaveAttribute("src", testRecord.image)
  })

  it("test OERSI download-list, if deactivated", async () => {
    testWithFakeData(testRecord)
    const customConfig = {
      ...defaultConfig.GENERAL_CONFIGURATION,
      detailPage: {content: [{field: "creator.name"}, {field: "description"}]},
    }
    render(<ResourceDetailsWithConfig config={customConfig} />)
    expect(
      await screen.findByRole("heading", {name: testRecord.name})
    ).toBeInTheDocument()
    const item = await screen.queryByText("fieldLabels.encoding.contentUrl")
    expect(item).not.toBeInTheDocument()
  })
  it("test multilingual title", async () => {
    testWithFakeData({
      ...testRecord,
      name: {de: "Test de", en: "Test en"},
    })
    const customConfig = {
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
    }
    render(<ResourceDetailsWithConfig config={customConfig} />)
    const titleNode = await screen.findByRole("heading", {name: "Test en"})
    expect(titleNode).toBeInTheDocument()
    global.fetch.mockRestore()
  })
  it("test multilingual title for field language selection", async () => {
    testWithFakeData({
      ...testRecord,
      name: [
        {language: "de", value: "Test de"},
        {language: "en", value: "Test en"},
      ],
    })
    const customConfig = {
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
    }
    render(<ResourceDetailsWithConfig config={customConfig} />)
    const titleNode = await screen.findByRole("heading", {name: "Test en"})
    expect(titleNode).toBeInTheDocument()
    global.fetch.mockRestore()
  })
  it("test multilingual description", async () => {
    testWithFakeData({
      ...testRecord,
      description: {de: "description de", en: "description en"},
    })
    const customConfig = {
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
              languageSelectionType: "map",
            },
          },
        ],
      },
    }
    render(<ResourceDetailsWithConfig config={customConfig} />)
    const titleNode = await screen.findByText("fieldLabels.description")
    const textNode = await screen.findByText("description en")
    expect(textNode).toBeInTheDocument()
    global.fetch.mockRestore()
  })
  it("test multilingual description for field language selection", async () => {
    testWithFakeData({
      ...testRecord,
      description: [
        {language: "de", value: "description de"},
        {language: "en", value: "description en"},
      ],
    })
    const customConfig = {
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
    }
    render(<ResourceDetailsWithConfig config={customConfig} />)
    const titleNode = await screen.findByText("fieldLabels.description")
    const textNode = await screen.findByText("description en")
    expect(textNode).toBeInTheDocument()
    global.fetch.mockRestore()
  })

  it("test OERSI download-list, if activated", async () => {
    testWithFakeData(testRecord)
    render(<ResourceDetailsWithConfig />)
    const item = await screen.findByText("fieldLabels.encoding.contentUrl")
    expect(item).toBeInTheDocument()
  })

  it("test OERSI download-list for data without encoding", async () => {
    testWithFakeData({
      ...testRecord,
      encoding: null,
    })
    render(<ResourceDetailsWithConfig />)
    const titleNode = await screen.findByRole("heading", {name: testRecord.name})
    expect(titleNode).toBeInTheDocument()
  })

  it("test OERSI download-list for data with only-embed-encoding", async () => {
    testWithFakeData({
      ...testRecord,
      encoding: [{embedUrl: "https://embed.url.org"}],
    })
    render(<ResourceDetailsWithConfig />)
    expect(
      await screen.findByRole("heading", {name: testRecord.name})
    ).toBeInTheDocument()
    const item = await screen.queryByText("fieldLabels.encoding.contentUrl")
    expect(item).not.toBeInTheDocument()
  })

  it("test rating, if deactivated", async () => {
    testWithFakeData(testRecord)
    const customConfig = {
      ...defaultConfig.GENERAL_CONFIGURATION,
      detailPage: {content: [{field: "creator.name"}, {field: "description"}]},
    }
    render(<ResourceDetailsWithConfig config={customConfig} />)
    expect(
      await screen.findByRole("heading", {name: testRecord.name})
    ).toBeInTheDocument()
    const item = await screen.queryByText("fieldLabels.aggregateRating.ratingCount")
    expect(item).not.toBeInTheDocument()
  })

  it("test rating, if activated", async () => {
    testWithFakeData({
      ...testRecord,
      aggregateRating: {
        ratingCount: 58,
      },
    })
    render(<ResourceDetailsWithConfig />)
    const item = await screen.findByText("fieldLabels.aggregateRating.ratingCount")
    expect(item).toBeInTheDocument()
  })

  it("test rating for data without rating", async () => {
    testWithFakeData({
      ...testRecord,
      aggregateRating: null,
    })
    render(<ResourceDetailsWithConfig />)
    expect(
      await screen.findByRole("heading", {name: testRecord.name})
    ).toBeInTheDocument()
    const titleNode = await screen.queryByText(
      "fieldLabels.aggregateRating.ratingCount"
    )
    expect(titleNode).not.toBeInTheDocument()
  })

  it("test versions, if deactivated", async () => {
    testWithFakeData({
      ...testRecord,
      hasVersion: [{id: "https://example.org/other/version", name: "v2"}],
    })
    const customConfig = {
      ...defaultConfig.GENERAL_CONFIGURATION,
      detailPage: {content: [{field: "creator.name"}, {field: "description"}]},
    }
    render(<ResourceDetailsWithConfig config={customConfig} />)
    expect(
      await screen.findByRole("heading", {name: testRecord.name})
    ).toBeInTheDocument()
    const item = await screen.queryByText("fieldLabels.hasVersion.name")
    expect(item).not.toBeInTheDocument()
  })

  it("test versions, if activated", async () => {
    testWithFakeData({
      ...testRecord,
      hasVersion: [
        {id: "https://example.org/other/v1", name: "v1"},
        {id: "https://example.org/other/v2", name: "v2"},
      ],
    })
    render(<ResourceDetailsWithConfig />)
    const item = await screen.findByText("fieldLabels.hasVersion.name")
    expect(item).toBeInTheDocument()
  })

  it("test versions for data without versions", async () => {
    testWithFakeData({
      ...testRecord,
      hasVersion: null,
    })
    render(<ResourceDetailsWithConfig />)
    expect(
      await screen.findByRole("heading", {name: testRecord.name})
    ).toBeInTheDocument()
    const titleNode = await screen.queryByText("fieldLabels.hasVersion.name")
    expect(titleNode).not.toBeInTheDocument()
  })

  it("test publisher", async () => {
    testWithFakeData({
      ...testRecord,
      publisher: [
        {
          name: "Pub1",
          type: "Organization",
        },
        {
          name: "Pub2",
          type: "Organization",
        },
      ],
    })
    render(<ResourceDetailsWithConfig />)
    const item = await screen.findByText("fieldLabels.publisher.name")
    expect(item).toBeInTheDocument()
  })

  it("test hasPart as nested list", async () => {
    testWithFakeData({
      ...testRecord,
      hasPart: [
        {
          name: "Unit 1",
          description: "Unit 1",
          citation: [{name: "Citation U1 C1"}, {name: "Citation U1 C2"}],
        },
        {
          name: "Unit 2",
          description: "Unit 2",
          citation: [{name: "Citation U2 C1"}, {name: "Citation U2 C2"}],
        },
      ],
    })
    render(<ResourceDetailsWithConfig />)
    const items = await screen.findAllByText("fieldLabels.hasPart.name")
    expect(items).toHaveLength(2)
    const citations = await screen.findAllByText("fieldLabels.hasPart.citation.name")
    expect(citations).toHaveLength(4)
  })

  it("test hasPart with simple list items", async () => {
    testWithFakeData({
      ...testRecord,
      hasPart: [
        {
          name: "Unit 1",
          description: "Unit 1",
        },
        {
          name: "Unit 2",
          description: "Unit 2",
        },
      ],
    })
    const customConfig = {
      ...defaultConfig.GENERAL_CONFIGURATION,
      detailPage: {content: [{field: "hasPart.name", multiItemsDisplay: "ul"}]},
    }
    render(<ResourceDetailsWithConfig config={customConfig} />)
    const item1 = await screen.findByText("Unit 1")
    expect(item1.nodeName.toLowerCase()).toBe("li")
  })

  it("test link without value label", async () => {
    testWithFakeData({
      ...testRecord,
      hasVersion: [{id: "https://example.org/other/v1"}],
    })
    render(<ResourceDetailsWithConfig />)
    const item = await screen.findByRole("link", {
      name: "https://example.org/other/v1",
    })
    expect(item).toBeInTheDocument()
  })

  it("test link without external link", async () => {
    testWithFakeData({
      ...testRecord,
      hasVersion: [{name: "v1"}],
    })
    render(<ResourceDetailsWithConfig />)
    const item = await screen.findByText("v1")
    expect(item).toBeInTheDocument()
    expect(item.nodeName.toLowerCase()).not.toBe("a")
  })

  it("test link without label and link", async () => {
    testWithFakeData({
      ...testRecord,
      hasVersion: [{other: "test"}],
    })
    render(<ResourceDetailsWithConfig />)
    expect(
      await screen.findByRole("heading", {name: testRecord.name})
    ).toBeInTheDocument()
    const titleNode = await screen.queryByText("fieldLabels.hasVersion.name")
    expect(titleNode).not.toBeInTheDocument()
  })

  it("test tabs", async () => {
    testWithFakeData({
      ...testRecord,
      description_generated: "generated description",
    })
    const customConfig = {
      ...defaultConfig.GENERAL_CONFIGURATION,
      detailPage: {
        content: [
          {
            field: "description_tabs",
            type: "tabs",
            content: [{field: "description"}, {field: "description_generated"}],
          },
        ],
      },
    }
    render(<ResourceDetailsWithConfig config={customConfig} />)
    const items = await screen.findAllByRole("tabpanel")
    expect(items).toHaveLength(1)
  })
})
