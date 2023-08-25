import React, {useEffect, useMemo, useState} from "react"
import {createTheme, ThemeProvider} from "@mui/material/styles"
import {cyan, green, grey} from "@mui/material/colors"
import {alpha, useMediaQuery} from "@mui/material"
import getConfig from "next/config"

import searchConfiguration from "../src/config/SearchConfiguration"
import OersiConfigContext from "../src/helpers/OersiConfigContext"
import {ReactiveBase} from "@appbaseio/reactivesearch"
import {useCookies} from "react-cookie"
import {useRouter} from "next/router"

const {publicRuntimeConfig} = getConfig()
function getTheme(
  isDarkMode = false,
  fontSize = null,
  colors = {
    primary: {
      main: cyan[300],
    },
    secondary: {
      main: green[300],
    },
  }
) {
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: colors.primary,
      secondary: colors.secondary,
      grey: {
        main: grey[300],
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

const Configuration = (props) => {
  const elasticSearchConfig = {
    app: process.env.NEXT_PUBLIC_ELASTICSEARCH_INDEX,
    url:
      process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL +
      process.env.NEXT_PUBLIC_BACKEND_API_PATH_SEARCH,
  }

  const {GENERAL_CONFIGURATION} = publicRuntimeConfig
  const trackTotalHits = GENERAL_CONFIGURATION.TRACK_TOTAL_HITS
    ? GENERAL_CONFIGURATION.TRACK_TOTAL_HITS
    : true
  const router = useRouter()
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)", {
    noSsr: true,
  })
  const [cookies, setCookie] = useCookies(["oersiColorMode"])
  const [mode, setMode] = useState("light")
  const isDarkMode = "dark" === mode
  const themeColors =
    isDarkMode && GENERAL_CONFIGURATION.THEME_COLORS_DARK
      ? GENERAL_CONFIGURATION.THEME_COLORS_DARK
      : GENERAL_CONFIGURATION.THEME_COLORS

  useEffect(() => {
    function setClientSideColorMode() {
      if (GENERAL_CONFIGURATION.FEATURES?.DARK_MODE) {
        if (cookies.oersiColorMode) {
          setMode(cookies.oersiColorMode)
          return
        }
        setMode(prefersDarkMode ? "dark" : "light")
      }
    }
    setClientSideColorMode()
  }, [])

  const [customFontSize, setCustomFontSize] = useState(12)

  const theme = useMemo(
    () =>
      themeColors
        ? getTheme(isDarkMode, customFontSize, themeColors)
        : getTheme(isDarkMode, customFontSize),
    [isDarkMode, themeColors, customFontSize]
  )

  const isMobile = useMediaQuery(theme.breakpoints.down("md"), {noSsr: false})
  const [isFilterViewOpen, setFilterViewOpen] = React.useState(!isMobile)

  const defaultCss = useMemo(
    () => `
body {
    background-color: ${isDarkMode ? "#414243" : "#c1c2c3"};
}
a {
  color: ${theme.palette.primary.main};
}
.oersi-textcolor-secondary {
  color: ${theme.palette.text.secondary};
}
.oersi-background-color-paper {
  background-color: ${theme.palette.background.paper};
}
.oersi-divider-color {
  border-color: ${theme.palette.divider};
}
`,
    [isDarkMode, theme]
  )

  useEffect(() => {
    async function loadExternalStyles() {
      const style = await getCustomStyles()
      const mergedStyle = defaultCss + (style ? style : "")
      const head = document.getElementsByTagName("head")[0]
      const styleElement = document.createElement("style")
      styleElement.type = "text/css"
      styleElement.className = "custom-style"
      styleElement.innerHTML = mergedStyle
      const existingCustomStyles = head.getElementsByClassName("custom-style")
      if (existingCustomStyles.length > 0) {
        head.replaceChild(styleElement, existingCustomStyles[0])
      } else {
        head.appendChild(styleElement)
      }
      return true
    }

    loadExternalStyles()
  }, [defaultCss])

  const [search, setSearch] = useState(
    new URLSearchParams(router.query).toString()
      ? "?" + new URLSearchParams(router.query).toString()
      : ""
  )
  const oersiConfig = useMemo(
    () => ({
      ...{
        filterSidebarWidth: 300,
        onChangeFontSize: (size) => setCustomFontSize(size),
        onToggleColorMode: () => {
          const newMode = mode === "dark" ? "light" : "dark"
          setMode(newMode)
          setCookie("oersiColorMode", newMode, {
            path: process.env.PUBLIC_URL,
            maxAge: 365 * 24 * 60 * 60,
          })
        },
        isMobile: isMobile,
        isFilterViewOpen: isFilterViewOpen,
        setFilterViewOpen: setFilterViewOpen,
      },
      ...GENERAL_CONFIGURATION,
      searchConfiguration: searchConfiguration,
    }),
    [
      GENERAL_CONFIGURATION,
      mode,
      setCookie,
      isMobile,
      isFilterViewOpen,
      setFilterViewOpen,
    ]
  )
  return (
    <ThemeProvider theme={theme}>
      <OersiConfigContext.Provider value={oersiConfig}>
        <ReactiveBase
          transformRequest={modifyElasticsearchRequest} // workaround: need to modify the request directly, because "TRACK_TOTAL_HITS"-default-query in ReactiveList in gone, if we change the pagesize
          {...elasticSearchConfig}
          key={isDarkMode} // workaround: need to rerender the whole component, otherwise switch light/dark mode does not work for reactivesearch components
          themePreset={isDarkMode ? "dark" : "light"}
          getSearchParams={() => search} // use params from url only on search-view, otherwise don't show search-state in url
          setSearchParams={(newURL) => {
            let newSearch = new URL(newURL).search
            setSearch(newSearch)
            router.push({
              pathname: "/",
              search: newSearch,
            })
          }}
        >
          {props.children}
        </ReactiveBase>
      </OersiConfigContext.Provider>
    </ThemeProvider>
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

export async function getCustomStyles() {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_PUBLIC_URL}/css/style-override.css`,
    {
      credentials: "same-origin",
    }
  )
  return result.text()
}
export default Configuration
