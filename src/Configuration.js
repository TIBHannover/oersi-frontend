import React, {useEffect} from "react"
import {ConfigProvider} from "antd"
import deDE from "antd/es/locale/de_DE"
import enUS from "antd/es/locale/en_US"
import {createTheme, ThemeProvider} from "@material-ui/core/styles"
import cyan from "@material-ui/core/colors/cyan"
import green from "@material-ui/core/colors/green"
import {BrowserRouter} from "react-router-dom"
import {ReactiveBase} from "@appbaseio/reactivesearch"
import {useTranslation} from "react-i18next"
import {OersiConfigContext} from "./helpers/use-context"
import {getRequest} from "./api/configuration/configurationService"

const theme = createTheme({
  palette: {
    primary: {
      main: cyan[300],
    },
    secondary: {
      main: green[300],
    },
  },
  overrides: {
    MuiButton: {
      // workaround: need to override hover-color here, because styles from other components (antd, bootstrap) breaks the material-ui-style otherwise
      containedPrimary: {
        "&:hover": {
          color: "rgba(0, 0, 0, 0.87)",
        },
      },
    },
    MuiLink: {
      root: {
        "&:focus": {
          textDecoration: "underline",
          outline: "1px dotted rgba(0, 0, 0, 0.87)",
        },
      },
    },
  },
})

/**
 * Configuration
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 */
const Configuration = (props) => {
  const {ELASTIC_SEARCH, GENERAL_CONFIGURATION} = window["runTimeConfig"]
  const {i18n} = useTranslation()

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
    var head = document.getElementsByTagName("head")[0]
    var styleElement = document.createElement("style")
    styleElement.type = "text/css"
    styleElement.className = "custom-style"
    styleElement.innerHTML = style !== "" ? style : ""
    head.appendChild(styleElement)
    return true
  }

  function returnRender() {
    if (ELASTIC_SEARCH !== null && ELASTIC_SEARCH.URL && ELASTIC_SEARCH.APP_NAME) {
      return (
        <OersiConfigContext.Provider value={GENERAL_CONFIGURATION}>
          <ConfigProvider locale={i18n.language === "de" ? deDE : enUS}>
            <ThemeProvider theme={theme}>
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
          </ConfigProvider>
        </OersiConfigContext.Provider>
      )
    } else {
      return <div>App configuration is missing! Please check the config-file.</div>
    }
  }

  return returnRender()
}

export default Configuration
