import React from "react"
import Header from "../../components/Header"
import {SearchIndexFrontendConfigContext} from "../../helpers/use-context"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {MemoryRouter} from "react-router"

jest.mock("../../components/SearchField", () => () => <div className="search" />)
const mockNavigate = jest.fn()
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}))

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: ["fr", "es", "it", "en", "de"],
  resources: {
    en: {
      language: {
        de: "German",
        en: "English",
      },
    },
  },
})

afterEach(() => {
  i18n.changeLanguage("en")
})

const defaultConfig = {
  PUBLIC_URL: "http://localhost/resources",
  AVAILABLE_LANGUAGES: ["de", "en"],
  FEATURES: {
    DARK_MODE: false,
  },
  isFilterViewOpen: true,
}

describe("Header ==> Test UI  ", () => {
  const HeaderWithConfig = (props) => {
    return (
      <MemoryRouter
        initialEntries={
          props.initialRouterEntries ? props.initialRouterEntries : ["/"]
        }
      >
        <SearchIndexFrontendConfigContext.Provider
          value={{
            ...{isDarkMode: props.darkMode ? props.darkMode : false},
            ...(props.appConfig ? props.appConfig : defaultConfig),
          }}
        >
          <Header {...props} />
        </SearchIndexFrontendConfigContext.Provider>
      </MemoryRouter>
    )
  }

  it("Header : should render without crashing", async () => {
    render(<HeaderWithConfig />)
    expect(screen.getByRole("link", {name: "SIDRE-TITLE"})).toBeInTheDocument()
  })

  it("Header : language menu", async () => {
    render(<HeaderWithConfig />)
    const lngButton = screen.getByRole("button", {name: "en"})
    await userEvent.click(lngButton)
    const deMenuItem = screen.getByRole("button", {
      name: "HEADER.CHANGE_LANGUAGE.de",
    })
    const enMenuItem = screen.getByRole("button", {
      name: "HEADER.CHANGE_LANGUAGE.en",
    })
    expect(deMenuItem).not.toHaveClass("active")
    expect(enMenuItem).toHaveClass("active")
    await userEvent.click(deMenuItem)
    expect(i18n.language).toBe("de")
  })

  it("Header : show title", async () => {
    render(<HeaderWithConfig />)
    expect(screen.queryByRole("link", {name: "SIDRE-TITLE"})).toBeInTheDocument()
  })

  it("Header : custom logo", async () => {
    const appConfig = {
      AVAILABLE_LANGUAGES: ["de", "en"],
      HEADER_LOGO_URL: "https://some.url/logo.svg",
    }
    render(<HeaderWithConfig appConfig={appConfig} />)
    const logo = screen.getByRole("img", {name: "SIDRE logo"})
    expect(logo.src).toBe("https://some.url/logo.svg")
  })

  it("Header : custom logo with placeholder", async () => {
    const appConfig = {
      AVAILABLE_LANGUAGES: ["de", "en"],
      HEADER_LOGO_URL: "https://some.url/logo{{dark}}{{small}}.svg",
    }
    render(<HeaderWithConfig appConfig={appConfig} />)
    const logo = screen.getByRole("img", {name: "SIDRE logo"})
    expect(logo.src).toBe("https://some.url/logo.svg")
  })

  it("Header : toggle color mode from light mode via settings menu, if dark-mode-feature active", async () => {
    const toggleMock = jest.fn()
    const appConfig = {
      onChangeColorMode: toggleMock,
      AVAILABLE_LANGUAGES: ["de", "en"],
      FEATURES: {
        DARK_MODE: true,
      },
    }
    render(<HeaderWithConfig appConfig={appConfig} />)
    const settingsMenuButton = screen.getByRole("button", {name: ""})
    await userEvent.click(settingsMenuButton)
    const toggleMenuItem = screen.getByRole("button", {name: "LABEL.DARK_MODE"})
    await userEvent.click(toggleMenuItem)
    expect(toggleMock).toBeCalled()
  })

  it("Header : toggle color mode from dark mode via settings menu, if dark-mode-feature active", async () => {
    const toggleMock = jest.fn()
    const appConfig = {
      onChangeColorMode: toggleMock,
      AVAILABLE_LANGUAGES: ["de", "en"],
      FEATURES: {
        DARK_MODE: true,
      },
    }
    render(<HeaderWithConfig darkMode={true} appConfig={appConfig} />)
    const settingsMenuButton = screen.getByRole("button", {name: ""})
    await userEvent.click(settingsMenuButton)
    const toggleMenuItem = screen.getByRole("button", {name: "LABEL.LIGHT_MODE"})
    await userEvent.click(toggleMenuItem)
    expect(toggleMock).toBeCalled()
  })

  it("Header : no settings menu, if no menu-features active", async () => {
    const appConfig = {
      AVAILABLE_LANGUAGES: ["de", "en"],
      FEATURES: {
        DARK_MODE: false,
      },
    }
    render(<HeaderWithConfig appConfig={appConfig} />)
    expect(
      screen.queryByRole("button", {name: "select settings"})
    ).not.toBeInTheDocument()
  })

  it("Header : info link, if activated", async () => {
    const appConfig = {
      ADDITIONAL_NAV_LINKS: [
        {
          en: {label: "Info", url: "https://oersi.org/resources/pages/en/"},
        },
      ],
      AVAILABLE_LANGUAGES: ["de", "en"],
      FEATURES: {
        DARK_MODE: true,
        CHANGE_FONTSIZE: true,
      },
    }
    render(<HeaderWithConfig appConfig={appConfig} />)
    const toInfoButton = screen.getByRole("link", {name: "to Info"})
    expect(toInfoButton).toBeInTheDocument()
  })
  it("Header : info link fallback", async () => {
    const appConfig = {
      ADDITIONAL_NAV_LINKS: [
        {
          de: {label: "Info", url: "https://oersi.org/resources/pages/en/"},
        },
      ],
      AVAILABLE_LANGUAGES: ["de", "en"],
      FEATURES: {
        DARK_MODE: true,
        CHANGE_FONTSIZE: true,
      },
    }
    render(<HeaderWithConfig appConfig={appConfig} />)
    const toInfoButton = screen.getByRole("link", {name: "to Info"})
    expect(toInfoButton).toBeInTheDocument()
  })
})
