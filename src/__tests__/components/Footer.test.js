import React from "react"
import Footer from "../../components/Footer"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import {act, render, screen} from "@testing-library/react"
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

beforeEach(() => {
  fetch.mockClear()
})

describe("Footer ==> Test UI  ", () => {
  it("Footer : should render without crashing and render HTML ", async () => {
    await act(() => Promise.resolve(render(<Footer />)))
    expect(screen.queryByRole("contentinfo")).toBeInTheDocument()
  })
  it("Footer : should render without crashing with wrong render HTML", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 200,
        text: () => "<html><head><body></>Footer not find</p></body></head></html>",
      })
    )
    await act(() => Promise.resolve(render(<Footer />)))
    expect(screen.queryByRole("contentinfo")).toBeInTheDocument()
  })

  it("Footer : should render without crashing without render HTML", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        text: () => "<html><head><body></>Footer not find</p></body></head></html>",
      })
    )
    await act(() => Promise.resolve(render(<Footer />)))
    expect(screen.queryByRole("contentinfo")).toBeInTheDocument()
  })
})
