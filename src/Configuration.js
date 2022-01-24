import React, {useEffect, useMemo, useState} from "react"
import {createTheme, ThemeProvider} from "@mui/material/styles"
import {BrowserRouter, useLocation} from "react-router-dom"
import {ReactiveBase} from "@appbaseio/reactivesearch"
import {OersiConfigContext} from "./helpers/use-context"
import getParams from "./helpers/helpers"
import {getRequest} from "./api/configuration/configurationService"

import {cyan, grey, green} from "@mui/material/colors"
import {alpha} from "@mui/material"

function getTheme(
  isDarkMode = false,
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

/**
 * Configuration
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 */
const Configuration = (props) => {
  const {ELASTIC_SEARCH, GENERAL_CONFIGURATION} = window["runTimeConfig"]
  const defaultConfiguration = {
    filterSidebarWidth: 300,
  }

  function returnRender() {
    if (ELASTIC_SEARCH !== null && ELASTIC_SEARCH.URL && ELASTIC_SEARCH.APP_NAME) {
      return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <RouterBasedConfig
            ELASTIC_SEARCH={ELASTIC_SEARCH}
            GENERAL_CONFIGURATION={{
              ...defaultConfiguration,
              ...GENERAL_CONFIGURATION,
            }}
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
  const location = useLocation()
  const [isDarkMode] = useState("dark" === getParams(location, "mode"))
  const {ELASTIC_SEARCH, GENERAL_CONFIGURATION} = props
  const themeColors = GENERAL_CONFIGURATION.THEME_COLORS
  const theme = useMemo(
    () => (themeColors ? getTheme(isDarkMode, themeColors) : getTheme(isDarkMode)),
    [isDarkMode, themeColors]
  )

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
    function loadExternalStyles(style) {
      const mergedStyle = defaultCss + (style !== "" ? style : "")
      const head = document.getElementsByTagName("head")[0]
      const styleElement = document.createElement("style")
      styleElement.type = "text/css"
      styleElement.className = "custom-style"
      styleElement.innerHTML = mergedStyle
      head.appendChild(styleElement)
      return true
    }

    async function fetchData() {
      const res = await getRequest("/css/style-override.css")
      const json = await res.text()
      if (json != null) {
        loadExternalStyles(json)
      }
    }

    fetchData()
  }, [defaultCss])

  return (
    <ReactiveBase
      className="reactive-base"
      app={ELASTIC_SEARCH.APP_NAME}
      url={ELASTIC_SEARCH.URL}
      themePreset={isDarkMode ? "dark" : "light"}
    >
      <ThemeProvider theme={theme}>
        {" "}
        <OersiConfigContext.Provider value={GENERAL_CONFIGURATION}>
          {props.children}
        </OersiConfigContext.Provider>
      </ThemeProvider>
    </ReactiveBase>
  )
}

export default Configuration
export {getTheme} // just for internal use in tests
