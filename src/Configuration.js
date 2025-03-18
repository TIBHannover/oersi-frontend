import React, {useMemo, useState} from "react"
import {createTheme, ThemeProvider} from "@mui/material/styles"
import {BrowserRouter, useLocation, useNavigate} from "react-router"
import {ReactiveBase} from "@appbaseio/reactivesearch"
import prepareSearchConfiguration from "./config/SearchConfiguration"
import {SearchIndexFrontendConfigContext} from "./helpers/use-context"

import {cyan, green, grey} from "@mui/material/colors"
import {alpha, CssBaseline, useMediaQuery} from "@mui/material"
import {useCookies} from "react-cookie"
import {Helmet} from "react-helmet"

function getTheme(isDarkMode = false, fontSize = null, colors = null) {
  if (!colors) {
    colors = {
      primary: {
        main: cyan[300],
      },
      secondary: {
        main: green[300],
      },
    }
  }
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: colors.primary,
      secondary: colors.secondary,
      grey: {
        main: grey[300],
      },
      background: {
        default: isDarkMode ? "#414243" : "#c1c2c3",
      },
    },
    breakpoints: {
      // migration to v5: we use our previous breakpoints for now, but should migrate this to the new standard
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    typography: {
      // workaround: inherit font-family from css, because otherwise a default font is used (for link-buttons for example)
      fontFamily: "inherit",
      ...(fontSize && {
        fontSize: fontSize,
      }),
    },
  })
  return createTheme(theme, {
    components: {
      MuiCssBaseline: {
        styleOverrides: `
.sidre-background-color-paper {
  background-color: ${theme.palette.background.paper};
}
.sidre-divider-color {
  border-color: ${theme.palette.divider};
}
a {
  color: ${theme.palette.primary.main};
}
.sidre-textcolor-secondary {
  color: ${theme.palette.text.secondary};
}
.full-width {
  width: 100%;
  width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
  width: -moz-available; /* WebKit-based browsers will ignore this. */
  width: stretch;
}

/* styling for scrollbar */

::-webkit-scrollbar {
  width: 13px;
  height: 5px;
}

::-webkit-scrollbar:hover {
  height: 50px;
}

::-webkit-scrollbar-track-piece {
  background-color: #fafafa;
}

::-webkit-scrollbar-thumb:vertical {
  height: 50px;
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(0, #ccc),
    color-stop(100%, #ccc)
  );
  border: 1px solid #0d0d0d;
  border-top: 1px solid #666;
  border-left: 1px solid #666;
  border-radius: 50px;
}

::-webkit-scrollbar-thumb:horizontal {
  width: 50px;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0, #ccc),
    color-stop(100%, #ccc)
  );
  border: 1px solid #1f1f1f;
  border-top: 1px solid #666;
  border-left: 1px solid #666;
  border-radius: 50px;
}
      `,
      },
      MuiButton: {
        variants: [
          {
            props: {variant: "contained", color: "grey"},
            style: {
              color: theme.palette.getContrastText(theme.palette.grey[300]),
              "&:hover": {
                backgroundColor: "#d5d5d5",
              },
            },
          },
          {
            props: {variant: "text", color: "grey"},
            style: {
              color: theme.palette.text.primary,
              "&:hover": {
                backgroundColor: alpha(
                  theme.palette.text.primary,
                  theme.palette.action.hoverOpacity
                ),
              },
            },
          },
        ],
      },
      MuiLink: {
        styleOverrides: {
          root: {
            "&:focus": {
              textDecoration: "underline",
              outline: "1px dotted rgba(0, 0, 0, 0.87)",
            },
          },
        },
      },
    },
  })
}

/**
 * Configuration
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 */
const Configuration = (props) => {
  const {BACKEND_API, ELASTIC_SEARCH_INDEX_NAME, GENERAL_CONFIGURATION} =
    window["runTimeConfig"]

  function returnRender() {
    if (
      BACKEND_API &&
      BACKEND_API.BASE_URL &&
      BACKEND_API.PATH_SEARCH &&
      ELASTIC_SEARCH_INDEX_NAME
    ) {
      return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <RouterBasedConfig
            BACKEND_SEARCH_API_URL={BACKEND_API.BASE_URL + BACKEND_API.PATH_SEARCH}
            ELASTIC_SEARCH_INDEX_NAME={ELASTIC_SEARCH_INDEX_NAME}
            GENERAL_CONFIGURATION={GENERAL_CONFIGURATION}
          >
            {props.children}
          </RouterBasedConfig>
        </BrowserRouter>
      )
    } else {
      return <div>App configuration is missing! Please check the config-file.</div>
    }
  }

  return returnRender()
}

// config that needs router hooks
const RouterBasedConfig = (props) => {
  const {BACKEND_SEARCH_API_URL, ELASTIC_SEARCH_INDEX_NAME, GENERAL_CONFIGURATION} =
    props
  const trackTotalHits = GENERAL_CONFIGURATION.TRACK_TOTAL_HITS
    ? GENERAL_CONFIGURATION.TRACK_TOTAL_HITS
    : true
  const location = useLocation()
  const navigate = useNavigate()
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)", {
    noSsr: true,
  })
  const [cookies, setCookie] = useCookies(["sidreColorMode"])
  const [colorMode, setColorMode] = useState(determineInitialColorMode())
  const isDarkMode =
    "dark" === colorMode || (colorMode === "auto" && prefersDarkMode)
  const [customFontSize, setCustomFontSize] = useState(12)
  const [isDesktopFilterViewOpen, setDesktopFilterViewOpen] = React.useState(true)
  const [isMobileFilterViewOpen, setMobileFilterViewOpen] = React.useState(false)

  const theme = useMemo(
    () =>
      getTheme(
        isDarkMode,
        customFontSize,
        isDarkMode && GENERAL_CONFIGURATION.THEME_COLORS_DARK
          ? GENERAL_CONFIGURATION.THEME_COLORS_DARK
          : GENERAL_CONFIGURATION.THEME_COLORS
      ),
    [
      GENERAL_CONFIGURATION.THEME_COLORS,
      GENERAL_CONFIGURATION.THEME_COLORS_DARK,
      isDarkMode,
      customFontSize,
    ]
  )
  function shouldResetResultPage(newSearch) {
    const newSearchParams = new URLSearchParams(newSearch ? newSearch : "")
    if (newSearchParams.has("results") && newSearchParams.get("results") > 1) {
      const oldSearchParams = new URLSearchParams(search ? search : "")
      oldSearchParams.delete("results")
      oldSearchParams.delete("size")
      newSearchParams.delete("results")
      newSearchParams.delete("size")
      return oldSearchParams.toString() !== newSearchParams.toString()
    }
    return false
  }
  function determineInitialColorMode() {
    if (!GENERAL_CONFIGURATION.FEATURES?.DARK_MODE) {
      return "light"
    }
    if (cookies.sidreColorMode) {
      return cookies.sidreColorMode
    }
    return prefersDarkMode ? "dark" : "light"
  }
  function storeColorMode(mode) {
    setCookie("sidreColorMode", mode, {
      path: process.env.PUBLIC_URL,
      maxAge: 365 * 24 * 60 * 60,
    })
    setColorMode(mode)
  }
  function changeColorMode(mode) {
    const newMode =
      "dark" === mode || (mode === "auto" && prefersDarkMode) ? "dark" : "light"
    document.documentElement.setAttribute("data-bs-theme", newMode)
  }

  useEffect(() => {
    changeColorMode(determineInitialColorMode())
  }, [])

  const isSearchView = location.pathname === "/"
  const [search, setSearch] = useState(location.search)
  const frontendConfig = useMemo(
    () => ({
      ...{
        filterSidebarWidth: 300,
        onChangeFontSize: (size) => setCustomFontSize(size),
        colorMode: colorMode,
        isDarkMode: isDarkMode,
        onChangeColorMode: (mode) => {
          storeColorMode(mode)
          changeColorMode(mode)
        },
        isDesktopFilterViewOpen: isDesktopFilterViewOpen,
        onCloseDesktopFilterView: () => setDesktopFilterViewOpen(false),
        onToggleDesktopFilterViewOpen: () =>
          setDesktopFilterViewOpen(!isDesktopFilterViewOpen),
        isMobileFilterViewOpen: isMobileFilterViewOpen,
        onCloseMobileFilterView: () => setMobileFilterViewOpen(false),
        onToggleMobileFilterViewOpen: () =>
          setMobileFilterViewOpen(!isMobileFilterViewOpen),
      },
      ...GENERAL_CONFIGURATION,
      searchConfiguration: prepareSearchConfiguration(GENERAL_CONFIGURATION),
    }),
    [
      GENERAL_CONFIGURATION,
      colorMode,
      isDarkMode,
      isDesktopFilterViewOpen,
      isMobileFilterViewOpen,
    ]
  )

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          href={process.env.PUBLIC_URL + "/css/style-override.css"}
        />
      </Helmet>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SearchIndexFrontendConfigContext.Provider value={frontendConfig}>
          <ReactiveBase
            className="reactive-base"
            transformRequest={modifyElasticsearchRequest} // workaround: need to modify the request directly, because "TRACK_TOTAL_HITS"-default-query in ReactiveList in gone, if we change the pagesize
            app={ELASTIC_SEARCH_INDEX_NAME}
            url={BACKEND_SEARCH_API_URL}
            key={isDarkMode} // workaround: need to rerender the whole component, otherwise switch light/dark mode does not work for reactivesearch components
            themePreset={isDarkMode ? "dark" : "light"}
            getSearchParams={() => (isSearchView ? location.search : search)} // use params from url only on search-view, otherwise don't show search-state in url
            setSearchParams={(newURL) => {
              let newSearch = new URL(newURL).search
              if (shouldResetResultPage(newSearch)) {
                const params = new URLSearchParams(newSearch)
                params.set("results", "1")
                newSearch = "?" + params.toString()
              }
              setSearch(newSearch)
              navigate({
                pathname: "/",
                search: newSearch,
              })
            }}
          >
            {props.children}
          </ReactiveBase>
        </SearchIndexFrontendConfigContext.Provider>
      </ThemeProvider>
    </>
  )

  function modifyElasticsearchQuery(query) {
    query["track_total_hits"] = trackTotalHits
    return query
  }
  function modifyElasticsearchRequest(req) {
    if (!req.body?.includes('"track_total_hits"') && trackTotalHits) {
      req.body = req.body
        ?.split("\n")
        .map((l) => {
          if (l.startsWith('{"query"')) {
            const query = modifyElasticsearchQuery(JSON.parse(l))
            return JSON.stringify(query)
          }
          return l
        })
        .join("\n")
    }
    return req
  }
}

export default Configuration
export {getTheme} // just for internal use in tests
