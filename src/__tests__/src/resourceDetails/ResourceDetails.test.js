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
  const testWithFakeData = (fakeData, ok = true) => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: ok,
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

  it("render ResourceDetails", async () => {
    const fakeData = {
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

  it("invalid response from backend", async () => {
    const fakeData = "invalid"
    testWithFakeData(fakeData)
    await act(renderDefault)
    // TODO expect error message
    ReactDOM.unmountComponentAtNode(container)
    global.fetch.mockRestore()
  })

  it("non ok response", async () => {
    const fakeData = {}
    testWithFakeData(fakeData, false)
    await act(renderDefault)
    // TODO expect error message
    ReactDOM.unmountComponentAtNode(container)
    global.fetch.mockRestore()
  })
})
