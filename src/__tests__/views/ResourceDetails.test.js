import React from "react"
import {OersiConfigContext} from "../../helpers/use-context"
import ResourceDetails from "../../views/ResourceDetails"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import {render, screen} from "@testing-library/react"
import {getTheme} from "../../Configuration"
import {ThemeProvider} from "@mui/material"

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
      audience: {
        "http://purl.org/dcx/lrmi-vocabs/educationalAudienceRole/teacher": "Teacher",
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
}

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
      <OersiConfigContext.Provider
        value={props.config ? props.config : defaultConfig.GENERAL_CONFIGURATION}
      >
        <ThemeProvider theme={getTheme()}>
          <ResourceDetails match={{params: {resourceId: "id"}}} />
        </ThemeProvider>
      </OersiConfigContext.Provider>
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
})
