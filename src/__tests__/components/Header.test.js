import React from "react"
import Header from "../../components/Header"
import {SearchIndexFrontendConfigContext} from "../../helpers/use-context"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import {render, screen} from "@testing-library/react"
import {getTheme} from "../../Configuration"
import {ThemeProvider} from "@mui/material"
import userEvent from "@testing-library/user-event"
import {MemoryRouter} from "react-router"

jest.mock("../../components/SearchField", () => () => <div className="search" />)
const mockNavigate = jest.fn()
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}))
jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn(),
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
  isDesktopFilterViewOpen: true,
  isMobileFilterViewOpen: false,
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
          value={props.appConfig ? props.appConfig : defaultConfig}
        >
          <ThemeProvider theme={getTheme(props.darkMode ? props.darkMode : false)}>
            <Header {...props} />
          </ThemeProvider>
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
    const lngButton = screen.getByRole("button", {name: "select language"})
    await userEvent.click(lngButton)
    const deMenuItem = screen.getByRole("menuitem", {
      name: "HEADER.CHANGE_LANGUAGE.de",
    })
    const enMenuItem = screen.getByRole("menuitem", {
      name: "HEADER.CHANGE_LANGUAGE.en",
    })
    expect(deMenuItem).not.toHaveClass("Mui-disabled")
    expect(enMenuItem).toHaveClass("Mui-disabled")
    await userEvent.click(deMenuItem)
    expect(i18n.language).toBe("de")
  })

  it("Header : show open sidebar filter button", async () => {
    const mock = jest.fn()
    render(
      <HeaderWithConfig
        appConfig={{...defaultConfig, onToggleDesktopFilterViewOpen: mock}}
      />
    )
    const filterButton = screen.getByRole("button", {
      name: "open sidebar filter drawer",
    })
    await userEvent.click(filterButton)
    expect(mock).toBeCalled()
  })

  it("Header : show open fullscreen filter button", async () => {
    const mock = jest.fn()
    render(
      <HeaderWithConfig
        appConfig={{...defaultConfig, onToggleMobileFilterViewOpen: mock}}
      />
    )
    const filterButton = screen.getByRole("button", {
      name: "open fullscreen filter drawer",
    })
    await userEvent.click(filterButton)
    expect(mock).toBeCalled()
  })

  it("Header : no open filter button for non-searchview", async () => {
    render(<HeaderWithConfig initialRouterEntries={["/some/page"]} />)
    expect(
      screen.queryByRole("button", {name: "open sidebar filter drawer"})
    ).not.toBeInTheDocument()
  })

  it("Header : back button for non-searchview", async () => {
    render(<HeaderWithConfig initialRouterEntries={["/some/page"]} />)
    const backButton = screen.getByRole("button", {name: "back to previous page"})
    await userEvent.click(backButton)
    expect(mockNavigate).toBeCalled()
  })

  it("Header : no back button for searchview", async () => {
    render(<HeaderWithConfig />)
    expect(
      screen.queryByRole("button", {name: "back to previous page"})
    ).not.toBeInTheDocument()
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
      onToggleColorMode: toggleMock,
      AVAILABLE_LANGUAGES: ["de", "en"],
      FEATURES: {
        DARK_MODE: true,
      },
    }
    render(<HeaderWithConfig appConfig={appConfig} />)
    const settingsMenuButton = screen.getByRole("button", {name: "select settings"})
    await userEvent.click(settingsMenuButton)
    const toggleMenuItem = screen.getByRole("menuitem", {name: "LABEL.DARK_MODE"})
    await userEvent.click(toggleMenuItem)
    expect(toggleMock).toBeCalled()
  })

  it("Header : toggle color mode from dark mode via settings menu, if dark-mode-feature active", async () => {
    const toggleMock = jest.fn()
    const appConfig = {
      onToggleColorMode: toggleMock,
      AVAILABLE_LANGUAGES: ["de", "en"],
      FEATURES: {
        DARK_MODE: true,
      },
    }
    render(<HeaderWithConfig darkMode={true} appConfig={appConfig} />)
    const settingsMenuButton = screen.getByRole("button", {name: "select settings"})
    await userEvent.click(settingsMenuButton)
    const toggleMenuItem = screen.getByRole("menuitem", {name: "LABEL.LIGHT_MODE"})
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

  it("Header : check compact menu for small devices and multiple menus and select item", async () => {
    const appConfig = {
      AVAILABLE_LANGUAGES: ["de", "en"],
      FEATURES: {
        DARK_MODE: true,
      },
    }
    render(<HeaderWithConfig appConfig={appConfig} />)
    const menuButton = screen.getByRole("button", {name: "select all-menu-items"})
    await userEvent.click(menuButton)
    const menuItem = screen.getByRole("menuitem", {name: "LABEL.LANGUAGE"})
    await userEvent.click(menuItem)
    expect(
      screen.queryByRole("menuitem", {name: "HEADER.CHANGE_LANGUAGE.de"})
    ).toBeVisible()
  })

  it("Header : no font size change settings, if deactivated", async () => {
    const appConfig = {
      AVAILABLE_LANGUAGES: ["de", "en"],
      FEATURES: {
        DARK_MODE: true,
        CHANGE_FONTSIZE: false,
      },
    }
    render(<HeaderWithConfig appConfig={appConfig} />)
    const settingsMenuButton = screen.getByRole("button", {name: "select settings"})
    await userEvent.click(settingsMenuButton)
    expect(screen.queryByRole("button", {name: "14"})).not.toBeInTheDocument()
    expect(screen.queryByRole("button", {name: "16"})).not.toBeInTheDocument()
    expect(screen.queryByRole("button", {name: "18"})).not.toBeInTheDocument()
  })

  it("Header : font size change settings, if activated", async () => {
    const mockChangeFontSize = jest.fn()
    const appConfig = {
      onChangeFontSize: mockChangeFontSize,
      AVAILABLE_LANGUAGES: ["de", "en"],
      FEATURES: {
        DARK_MODE: true,
        CHANGE_FONTSIZE: true,
      },
    }
    render(<HeaderWithConfig appConfig={appConfig} />)
    const settingsMenuButton = screen.getByRole("button", {name: "select settings"})
    await userEvent.click(settingsMenuButton)
    await userEvent.click(screen.getByRole("button", {name: "14"}))
    await userEvent.click(screen.getByRole("button", {name: "16"}))
    await userEvent.click(screen.getByRole("button", {name: "18"}))
    expect(mockChangeFontSize).toBeCalledTimes(3)
  })
  it("Header : info link, if activated", async () => {
    const appConfig = {
      EXTERNAL_INFO_LINK: {
        en: "https://oersi.org/resources/pages/en",
      },
      AVAILABLE_LANGUAGES: ["de", "en"],
      FEATURES: {
        DARK_MODE: true,
        CHANGE_FONTSIZE: true,
      },
    }
    render(<HeaderWithConfig appConfig={appConfig} />)
    const toInfoButton = screen.getByRole("link", {name: "to info pages"})
    expect(toInfoButton).toBeInTheDocument()
  })
  it("Header : info link fallback", async () => {
    const appConfig = {
      EXTERNAL_INFO_LINK: {
        de: "https://oersi.org/resources/pages/en",
      },
      AVAILABLE_LANGUAGES: ["de", "en"],
      FEATURES: {
        DARK_MODE: true,
        CHANGE_FONTSIZE: true,
      },
    }
    render(<HeaderWithConfig appConfig={appConfig} />)
    const toInfoButton = screen.getByRole("link", {name: "to info pages"})
    expect(toInfoButton).toBeInTheDocument()
  })
})
