import React from "react"
import {OersiConfigContext} from "../../helpers/use-context"
import ResourceDetails from "../../views/ResourceDetails"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import {fireEvent, render, screen} from "@testing-library/react"
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
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
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
        <OersiConfigContext.Provider
          value={props.config ? props.config : defaultConfig.GENERAL_CONFIGURATION}
        >
          <ThemeProvider theme={getTheme()}>
            <ResourceDetails match={{params: {resourceId: "id"}}} />
          </ThemeProvider>
        </OersiConfigContext.Provider>
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
      <ResourceDetailsWithConfig config={getFeatureConfig({EMBED_OER: true})} />
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
      <ResourceDetailsWithConfig config={getFeatureConfig({EMBED_OER: false})} />
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
      <ResourceDetailsWithConfig config={getFeatureConfig({EMBED_OER: true})} />
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
      <ResourceDetailsWithConfig config={getFeatureConfig({EMBED_OER: true})} />
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

  it("test OERSI thumbnail, if activated", async () => {
    testWithFakeData(testRecord)
    render(
      <ResourceDetailsWithConfig
        config={getFeatureConfig({OERSI_THUMBNAILS: true})}
      />
    )
    const image = await screen.findByAltText("fallback workaround")
    expect(image).toHaveAttribute(
      "src",
      expect.stringMatching(/\/thumbnail\/.*\.webp/)
    )
  })

  it("test OERSI thumbnail for non-embeddable mat", async () => {
    testWithFakeData({
      ...testRecord,
      license: {},
    })
    render(
      <ResourceDetailsWithConfig
        config={getFeatureConfig({OERSI_THUMBNAILS: true})}
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
    render(
      <ResourceDetailsWithConfig
        config={getFeatureConfig({SHOW_ENCODING_DOWNLOADS: false})}
      />
    )
    const item = await screen.queryByRole("heading", {name: "LABEL.FILES"})
    expect(item).not.toBeInTheDocument()
  })

  it("test OERSI download-list, if activated", async () => {
    testWithFakeData(testRecord)
    render(
      <ResourceDetailsWithConfig
        config={getFeatureConfig({SHOW_ENCODING_DOWNLOADS: true})}
      />
    )
    const item = await screen.findByRole("heading", {name: "LABEL.FILES"})
    expect(item).toBeInTheDocument()
  })

  it("test OERSI download-list for data without encoding", async () => {
    testWithFakeData({
      ...testRecord,
      encoding: null,
    })
    render(
      <ResourceDetailsWithConfig
        config={getFeatureConfig({SHOW_ENCODING_DOWNLOADS: true})}
      />
    )
    const titleNode = await screen.findByRole("heading", {name: testRecord.name})
    expect(titleNode).toBeInTheDocument()
  })

  it("test OERSI download-list for data with only-embed-encoding", async () => {
    testWithFakeData({
      ...testRecord,
      encoding: [{embedUrl: "https://embed.url.org"}],
    })
    render(
      <ResourceDetailsWithConfig
        config={getFeatureConfig({SHOW_ENCODING_DOWNLOADS: true})}
      />
    )
    const item = await screen.queryByRole("heading", {name: "LABEL.FILES"})
    expect(item).not.toBeInTheDocument()
  })

  it("test rating, if deactivated", async () => {
    testWithFakeData(testRecord)
    render(
      <ResourceDetailsWithConfig config={getFeatureConfig({SHOW_RATING: false})} />
    )
    const item = await screen.queryByRole("heading", {name: "LABEL.RATING"})
    expect(item).not.toBeInTheDocument()
  })

  it("test rating, if activated", async () => {
    testWithFakeData({
      ...testRecord,
      aggregateRating: {
        ratingCount: 58,
      },
    })
    render(
      <ResourceDetailsWithConfig config={getFeatureConfig({SHOW_RATING: true})} />
    )
    const item = await screen.findByRole("heading", {name: "LABEL.RATING"})
    expect(item).toBeInTheDocument()
  })

  it("test rating for data without rating", async () => {
    testWithFakeData({
      ...testRecord,
      aggregateRating: null,
    })
    render(
      <ResourceDetailsWithConfig config={getFeatureConfig({SHOW_RATING: true})} />
    )
    const titleNode = await screen.queryByRole("heading", {name: "LABEL.RATING"})
    expect(titleNode).not.toBeInTheDocument()
  })

  it("test versions, if deactivated", async () => {
    testWithFakeData({
      ...testRecord,
      hasVersion: [{id: "https://example.org/other/version", name: "v2"}],
    })
    render(
      <ResourceDetailsWithConfig config={getFeatureConfig({SHOW_VERSIONS: false})} />
    )
    const item = await screen.queryByRole("heading", {name: "LABEL.VERSIONS"})
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
    render(
      <ResourceDetailsWithConfig config={getFeatureConfig({SHOW_VERSIONS: true})} />
    )
    const item = await screen.findByRole("heading", {name: "LABEL.VERSIONS"})
    expect(item).toBeInTheDocument()
  })

  it("test versions for data without versions", async () => {
    testWithFakeData({
      ...testRecord,
      hasVersion: null,
    })
    render(
      <ResourceDetailsWithConfig config={getFeatureConfig({SHOW_VERSIONS: true})} />
    )
    const titleNode = await screen.queryByRole("heading", {name: "LABEL.VERSIONS"})
    expect(titleNode).not.toBeInTheDocument()
  })
})
