import React, {useState} from "react"
import {withTranslation} from "react-i18next"
import {ConfigurationRunTime} from "../../helpers/use-context"
import i18next from "i18next"
import "./cookie.css"
import {isValidURL, buildUrl} from "../../helpers/helpers"
import {useCookies} from "react-cookie"

/**
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @param {*} props properties
 */
const Cookie = (props) => {
  const {PRIVACY_POLICY_LINK} = React.useContext(ConfigurationRunTime)
  const [cookies, setCookie] = useCookies(["oerndsCookieInfoDismissed"])
  const [visible, setVisible] = useState(!Boolean(cookies.oerndsCookieInfoDismissed))

  const onDismissCookieInfo = () => {
    setCookie("oerndsCookieInfoDismissed", true, {
      path: process.env.PUBLIC_URL,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    })
    setVisible(false)
  }

  return (
    <div id="toast" className={visible === true ? "show" : "hide"}>
      <div id="desc">
        <div id="cookieConsent">
          {props.t("COOKIE.TITLE")}
          {getCurrentPathWithTranslation(
            PRIVACY_POLICY_LINK,
            i18next.language,
            i18next.languages
          ) !== undefined && (
            <a
              href={getCurrentPathWithTranslation(
                PRIVACY_POLICY_LINK,
                i18next.language,
                i18next.languages
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              {props.t("COOKIE.MORE_INFO")}
            </a>
          )}
          <button onClick={onDismissCookieInfo} className="cookieConsentOK">
            {props.t("COOKIE.BUTTON_ACCEPT")}
          </button>
        </div>
      </div>
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
