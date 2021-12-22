import React from "react"
import ReactDOM from "react-dom"
import {act} from "react-dom/test-utils"
import Footer from "../../components/Footer"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"
const footerFakehtml = "<footer><p>this is a test<p></footer>"

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: ["fr", "es", "it", "en", "de"],
  resources: {
    en: {},
  },
})

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    text: () => footerFakehtml,
  })
)

beforeAll(
  () => console.log("@ beforeAll"),
  jest.spyOn(React, "useEffect").mockImplementation(React.useLayoutEffect)
)

afterAll(() => React.useEffect.mockRestore())

let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  fetch.mockClear()
  container = document.createElement("div")
  document.body.appendChild(container)
})

describe("Footer ==> Test UI  ", () => {
  it("Footer : should render without crashing and render HTML ", async () => {
    await act(async () => {
      ReactDOM.render(<Footer />, container)
    })

    ReactDOM.unmountComponentAtNode(container)
  })
  it("Footer : should render without crashing with wrong render HTML", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 200,
        text: () => "<html><head><body></>Footer not find</p></body></head></html>",
      })
    )
    await act(async () => {
      ReactDOM.render(<Footer />, container)
    })

    ReactDOM.unmountComponentAtNode(container)
  })

  it("Footer : should render without crashing without render HTML", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        text: () => "<html><head><body></>Footer not find</p></body></head></html>",
      })
    )
    await act(async () => {
      ReactDOM.render(<Footer />, container)
    })

    ReactDOM.unmountComponentAtNode(container)
  })
})
