import React from "react"
import Header from "../../components/Header"
import {OersiConfigContext} from "../../helpers/use-context"
import config from "react-global-configuration"
import prod from "../../config/prod"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import {render, screen} from "@testing-library/react"
import {getTheme} from "../../Configuration"
import {ThemeProvider} from "@mui/material"
import userEvent from "@testing-library/user-event"

jest.mock("../../components/SearchField", () => () => <div className="search" />)

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: ["fr", "es", "it", "en", "de"],
  resources: {
    en: {},
  },
})

beforeAll(() => {
  config.set(prod)
})
afterEach(() => {
  i18n.changeLanguage("en")
})

const defaultConfig = {
  AVAILABLE_LANGUAGES: ["de", "en"],
  FEATURES: {},
}

describe("Header ==> Test UI  ", () => {
  const HeaderWithConfig = (props) => {
    return (
      <OersiConfigContext.Provider
        value={props.appConfig ? props.appConfig : defaultConfig}
      >
        <ThemeProvider theme={getTheme()}>
          <Header />
        </ThemeProvider>
      </OersiConfigContext.Provider>
    )
  }

  it("Header : should render without crashing", async () => {
    render(<HeaderWithConfig />)
    expect(screen.getByRole("link", {name: "OERSI-TITLE"})).toBeInTheDocument()
  })

  it("Header : language menu", async () => {
    render(<HeaderWithConfig />)
    const lngButton = screen.getByRole("button", {name: "select language"})
    userEvent.click(lngButton)
    const deMenuItem = screen.getByRole("menuitem", {
      name: "HEADER.CHANGE_LANGUAGE.de",
    })
    const enMenuItem = screen.getByRole("menuitem", {
      name: "HEADER.CHANGE_LANGUAGE.en",
    })
    expect(deMenuItem).not.toHaveClass("Mui-disabled")
    expect(enMenuItem).toHaveClass("Mui-disabled")
    userEvent.click(deMenuItem)
    expect(i18n.language).toBe("de")
  })

  it("Header : show title", async () => {
    render(<HeaderWithConfig />)
    expect(screen.queryByRole("link", {name: "OERSI-TITLE"})).toBeInTheDocument()
  })

  it("Header : custom logo", async () => {
    const appConfig = {
      AVAILABLE_LANGUAGES: ["de", "en"],
      HEADER_LOGO_URL: "https://some.url/logo.svg",
    }
    render(<HeaderWithConfig appConfig={appConfig} />)
    const logo = screen.getByRole("img", {name: "OERSI logo"})
    expect(logo.src).toBe("https://some.url/logo.svg")
  })

  it("Header : custom logo with placeholder", async () => {
    const appConfig = {
      AVAILABLE_LANGUAGES: ["de", "en"],
      HEADER_LOGO_URL: "https://some.url/logo{{dark}}{{small}}.svg",
    }
    render(<HeaderWithConfig appConfig={appConfig} />)
    const logo = screen.getByRole("img", {name: "OERSI logo"})
    expect(logo.src).toBe("https://some.url/logo.svg")
  })
})
