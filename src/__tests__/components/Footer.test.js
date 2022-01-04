import React from "react"
import Footer from "../../components/Footer"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import {render, screen, waitFor} from "@testing-library/react"
const footerFakehtml = "<footer><p>this is a test<p></footer>"

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: ["fr", "es", "it", "en", "de"],
  resources: {
    en: {},
  },
})

describe("Footer ==> Test UI  ", () => {
  it("Footer : should render without crashing and render HTML ", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        text: () => footerFakehtml,
      })
    )
    await waitFor(() => render(<Footer />))
    expect(screen.queryByRole("contentinfo")).toBeInTheDocument()

    global.fetch.mockRestore()
  })
  it("Footer : should render without crashing with wrong render HTML", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 200,
        text: () => "<html><head><body></>Footer not find</p></body></head></html>",
      })
    )
    await waitFor(() => render(<Footer />))
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument()

    global.fetch.mockRestore()
  })

  it("Footer : should render without crashing without render HTML", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        text: () => "<html><head><body></>Footer not find</p></body></head></html>",
      })
    )
    await waitFor(() => render(<Footer />))
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument()

    global.fetch.mockRestore()
  })
})
