import React from "react"
import ToastComponent from "../toast/ToastComponent"
import App from "../../App"
import config from "react-global-configuration"
import ErrorComponent from "../errorComponent/ErrorComponent"
import i18next from "i18next"
import {ConfigurationRunTime} from "../../helpers/use-context"

/**
 * Configuration
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 */
const Configuration = () => {
  const {ELASTIC_SEARCH, LANGUAGE, GENERAL_CONFIGURATION} = window["runTimeConfig"]
  i18next.changeLanguage(LANGUAGE !== "" && LANGUAGE !== undefined && LANGUAGE)

  function returnRender() {
    if (ELASTIC_SEARCH !== null && ELASTIC_SEARCH.URL && ELASTIC_SEARCH.APP_NAME) {
      return (
        <ConfigurationRunTime.Provider value={GENERAL_CONFIGURATION}>
          <App config={config} elasticSearch={ELASTIC_SEARCH} />
        </ConfigurationRunTime.Provider>
      )
    } else {
      return (
        <>
          <ErrorComponent />
          <ToastComponent
            message={"Something Was wrong and We can't load the page "}
            title={"Error on Load"}
            type={"error"}
          />
        </>
      )
    }
  }

  return returnRender()
}

export default Configuration
