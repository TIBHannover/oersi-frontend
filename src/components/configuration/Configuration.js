import React from "react"
import App from "../../App"
import config from "react-global-configuration"
import {Helmet} from "react-helmet"
import i18next from "i18next"
import {withTranslation} from "react-i18next"
import {ConfigurationRunTime} from "../../helpers/use-context"
import {ConfigProvider} from "antd"
import deDE from "antd/es/locale/de_DE"
import enUS from "antd/es/locale/en_US"

/**
 * Configuration
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 */
const Configuration = (props) => {
  const {ELASTIC_SEARCH, GENERAL_CONFIGURATION} = window["runTimeConfig"]

  function returnRender() {
    if (ELASTIC_SEARCH !== null && ELASTIC_SEARCH.URL && ELASTIC_SEARCH.APP_NAME) {
      return (
        <ConfigurationRunTime.Provider value={GENERAL_CONFIGURATION}>
          <ConfigProvider locale={i18next.language === "de" ? deDE : enUS}>
            <Helmet>
              <title>{props.t("META.TITLE")}</title>
              <meta name="description" content={props.t("META.DESCRIPTION")} />
            </Helmet>
            <App config={config} elasticSearch={ELASTIC_SEARCH} />
          </ConfigProvider>
        </ConfigurationRunTime.Provider>
      )
    } else {
      return <div>App configuration is missing! Please check the config-file.</div>
    }
  }

  return returnRender()
}

export default withTranslation()(Configuration)
