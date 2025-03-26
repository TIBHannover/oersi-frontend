import React, {useState} from "react"
import {useCookies} from "react-cookie"
import {useTranslation} from "react-i18next"

import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import {getPrivacyPolicyLinkForLanguage} from "../helpers/helpers"
import Button from "react-bootstrap/Button"
import Fade from "react-bootstrap/Fade"

/**
 * @param {*} props properties
 */
const CookieNotice = (props) => {
  const {t, i18n} = useTranslation()
  const {PRIVACY_POLICY_LINK} = React.useContext(SearchIndexFrontendConfigContext)
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
    <Fade in={visible} mountOnEnter unmountOnExit>
      <div
        id="cookieConsent"
        className="p-3 z-3 bg-body-tertiary text-center position-fixed bottom-0 w-100"
        aria-label="cookieConsent"
      >
        {t("COOKIE.TITLE")}
        {getPrivacyPolicyLinkForLanguage(
          PRIVACY_POLICY_LINK,
          i18n.language,
          i18n.languages
        ) !== undefined && (
          <>
            {" "}
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
          </>
        )}
        <Button
          onClick={onDismissCookieInfo}
          className="cookieConsentOK ms-2"
          variant="primary"
        >
          {t("COOKIE.BUTTON_ACCEPT")}
        </Button>
      </div>
    </Fade>
  )
}

export default CookieNotice
