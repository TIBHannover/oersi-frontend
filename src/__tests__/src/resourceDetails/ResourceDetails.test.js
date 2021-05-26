import React from "react"
import ReactDOM from "react-dom"
import ResourceDetails from "../../../components/resourceDetails/ResourceDetails"
import {act} from "react-dom/test-utils"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"

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

let container = null
beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
})
afterEach(() => {
  container.remove()
  container = null
})

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
  const renderDefault = async () => {
    ReactDOM.render(
      <ResourceDetails match={{params: {resourceId: "id"}}} />,
      container
    )
  }

  it("render ResourceDetails minimal example", async () => {
    const fakeData = {
      id: "https://oer-test.com/some-resource/index.html",
      name: "TestTitle",
    }
    testWithFakeData(fakeData)
    await act(renderDefault)
    expect(container.querySelector(".MuiTypography-root").textContent).toBe(
      fakeData.name
    )
    ReactDOM.unmountComponentAtNode(container)
    global.fetch.mockRestore()
  })

  it("render ResourceDetails", async () => {
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
      id: "https://oer-test.com/some-resource/index.html",
      image: "https://oer-test.com/some-resource/image.png",
      inLanguage: ["en"],
      learningResourceType: [
        {
          id: "https://w3id.org/kim/hcrt/video",
        },
      ],
      license: "https://creativecommons.org/licenses/by/4.0/deed.de",
      mainEntityOfPage: [
        {
          dateModified: "2020-07-09T06:13:48.000Z",
          provider: {
            name: "TESTPROVIDER",
          },
          id:
            "https://uni-tuebingen.oerbw.de/edu-sharing/components/render/bd3a8bff-7973-4990-aed8-33a7cb9390f8",
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
    testWithFakeData(fakeData)
    await act(renderDefault)
    expect(container.querySelector(".MuiTypography-root").textContent).toBe(
      fakeData.name
    )
    ReactDOM.unmountComponentAtNode(container)
    global.fetch.mockRestore()
  })

  it("invalid response from backend", async () => {
    const fakeData = "invalid"
    testWithFakeData(fakeData)
    await act(renderDefault)
    const errorNodes = Array.from(container.querySelectorAll(".error-message"))
    expect(errorNodes).toHaveLength(1)
    ReactDOM.unmountComponentAtNode(container)
    global.fetch.mockRestore()
  })

  it("non ok response", async () => {
    const fakeData = {}
    testWithFakeData(fakeData, false, 404)
    await act(renderDefault)
    const errorNodes = Array.from(container.querySelectorAll(".error-message"))
    expect(errorNodes).toHaveLength(1)
    ReactDOM.unmountComponentAtNode(container)
    global.fetch.mockRestore()
  })

  it("non ok response with status text", async () => {
    const fakeData = {}
    testWithFakeData(fakeData, false, 404, "Not found")
    await act(renderDefault)
    const errorNodes = Array.from(container.querySelectorAll(".error-message"))
    expect(errorNodes).toHaveLength(1)
    ReactDOM.unmountComponentAtNode(container)
    global.fetch.mockRestore()
  })
})
