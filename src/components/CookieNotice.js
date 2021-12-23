import React, {useState} from "react"
import {useTranslation} from "react-i18next"
import {OersiConfigContext} from "../helpers/use-context"
import "./CookieNotice.css"
import {getPrivacyPolicyLinkForLanguage} from "../helpers/helpers"
import {useCookies} from "react-cookie"

/**
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @param {*} props properties
 */
const CookieNotice = (props) => {
  const {t, i18n} = useTranslation()
  const {PRIVACY_POLICY_LINK} = React.useContext(OersiConfigContext)
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
        <div id="cookieConsent" aria-label="cookieConsent">
          {t("COOKIE.TITLE")}
          {getPrivacyPolicyLinkForLanguage(
            PRIVACY_POLICY_LINK,
            i18n.language,
            i18n.languages
          ) !== undefined && (
            <a
              href={getPrivacyPolicyLinkForLanguage(
                PRIVACY_POLICY_LINK,
                i18n.language,
                i18n.languages
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("COOKIE.MORE_INFO")}
            </a>
          )}
          <button onClick={onDismissCookieInfo} className="cookieConsentOK">
            {t("COOKIE.BUTTON_ACCEPT")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieNotice
