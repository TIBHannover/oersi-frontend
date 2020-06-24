import React, {useState, useEffect} from "react"
import {getConfiguration} from "../../service/configuration/configurationService"
import ToastComponent from "../toast/ToastComponent"
import App from "../../App"
import config from "react-global-configuration"
import ErrorComponent from "../errorComponent/ErrorComponent"
import i18next from "i18next"

/**
 * Configuration
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 */
const Configuration = () => {
  const [configData, setConfigData] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const res = await getConfiguration("/config/config.json")
      const json = await res.json()
      if (json != null) {
        setConfigData(json.ELASTIC_SEARCH)
        setIsLoaded(true)
        if (json.LANGUAGE !== "" && json.LANGUAGE !== undefined)
          i18next.changeLanguage(json.LANGUAGE)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      {isLoaded && configData != null && <App data={configData} config={config} />}
      {isLoaded && configData == null && (
        <>
          <ErrorComponent />
          <ToastComponent
            message={"Something Was wrong and We can't load the page "}
            title={"Error on Load"}
            type={"error"}
          />
        </>
      )}
    </>
  )
}

export default Configuration
