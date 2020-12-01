import React from "react"
import {CookieBanner} from "@palmabit/react-cookie-law"
import {withTranslation} from "react-i18next"
import {ConfigurationRunTime} from "../../helpers/use-context"
import i18next from "i18next"
import "./cookie.css"
import {isValidURL, buildUrl} from "../../helpers/helpers"
/**
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @param {*} props properties
 */
const Cookie = (props) => {
  const {PRIVACY_POLICY_LINK} = React.useContext(ConfigurationRunTime)
  return (
    <div>
      <CookieBanner
        message={props.t("COOKIE.TITLE")}
        wholeDomain={true}
        policyLink={
          getCurrentPathWithTranslation(
            PRIVACY_POLICY_LINK,
            i18next.language,
            i18next.languages
          ) !== undefined
            ? getCurrentPathWithTranslation(
                PRIVACY_POLICY_LINK,
                i18next.language,
                i18next.languages
              )
            : ""
        }
        privacyPolicyLinkText={
          getCurrentPathWithTranslation(
            PRIVACY_POLICY_LINK,
            i18next.language,
            i18next.languages
          ) !== undefined
            ? props.t("COOKIE.LINK_TEXT")
            : ""
        }
        necessaryOptionText={props.t("COOKIE.NECESSARY_COOKIE")}
        acceptButtonText={props.t("COOKIE.BUTTON_ACCEPT")}
        onAccept={() => {}}
        showPreferencesOption={false}
        showMarketingOption={false}
        showStatisticsOption={false}
        showNecessaryOption={false}
        onAcceptPreferences={() => {}}
        onAcceptStatistics={() => {}}
        onAcceptMarketing={() => {}}
      />
    </div>
  )

  /**
   * function that check if one of Links in configuration match Language code from translate
   * @param {Array} privacyPolicyLinks All link from Configuration
   * @param {String} lang  Language Code from Translate
   */
  function getCurrentPathWithTranslation(privacyPolicyLinks, lang, fallBackLang) {
    let checkIfExist = {}
    if (privacyPolicyLinks || privacyPolicyLinks instanceof Array) {
      checkIfExist = Array.from(privacyPolicyLinks).filter(
        (item) => item["language"] === lang && item["path"]
      )[0]
      if (checkIfExist === undefined) {
        checkIfExist = Array.from(privacyPolicyLinks).filter(
          (item) => fallBackLang.includes(item["language"]) && item["path"]
        )[0]
      }
    }

    if (checkIfExist !== undefined)
      return !isValidURL(checkIfExist["path"])
        ? buildUrl(checkIfExist["path"])
        : checkIfExist["path"]

    return undefined
  }
}

export default withTranslation()(Cookie)
