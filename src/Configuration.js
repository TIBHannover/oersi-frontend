import React, {useEffect} from "react"
import {createTheme, ThemeProvider} from "@mui/material/styles"
import {BrowserRouter} from "react-router-dom"
import {ReactiveBase} from "@appbaseio/reactivesearch"
import {OersiConfigContext} from "./helpers/use-context"
import {getRequest} from "./api/configuration/configurationService"

import {cyan, grey, green} from "@mui/material/colors"
import {alpha} from "@mui/material"

const theme = createTheme({
  palette: {
    primary: {
      main: cyan[300],
    },
    secondary: {
      main: green[300],
    },
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
const customTheme = createTheme(theme, {
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
const defaultCss = `
a {
  color: ${theme.palette.primary.main};
}
`

/**
 * Configuration
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 */
const Configuration = (props) => {
  const {ELASTIC_SEARCH, GENERAL_CONFIGURATION} = window["runTimeConfig"]

  useEffect(() => {
    async function fetchData() {
      const res = await getRequest("/css/style-override.css")
      const json = await res.text()
      if (json != null) {
        loadExternalStyles(json)
      }
    }

    fetchData()
  }, [])

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

  function returnRender() {
    if (ELASTIC_SEARCH !== null && ELASTIC_SEARCH.URL && ELASTIC_SEARCH.APP_NAME) {
      return (
        <OersiConfigContext.Provider value={GENERAL_CONFIGURATION}>
          <ThemeProvider theme={customTheme}>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
              <ReactiveBase
                className="reactive-base"
                app={ELASTIC_SEARCH.APP_NAME}
                url={ELASTIC_SEARCH.URL}
              >
                {props.children}
              </ReactiveBase>
            </BrowserRouter>
          </ThemeProvider>
        </OersiConfigContext.Provider>
      )
    } else {
      return <div>App configuration is missing! Please check the config-file.</div>
    }
  }

  return returnRender()
}

export default Configuration
export {customTheme}
