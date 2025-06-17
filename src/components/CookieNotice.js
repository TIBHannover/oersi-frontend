import React, {useState} from "react"
import {CookiesProvider, useCookies} from "react-cookie"
import {useTranslation} from "react-i18next"

import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import {useLanguageSpecificPrivacyPolicyLink} from "../helpers/helpers"
import Button from "react-bootstrap/Button"
import Fade from "react-bootstrap/Fade"

const CookieInfo = () => {
  const {t} = useTranslation()
  const {PUBLIC_BASE_PATH} = React.useContext(SearchIndexFrontendConfigContext)
  const privacyPolicyLink = useLanguageSpecificPrivacyPolicyLink()
  const [cookies, setCookie] = useCookies(["oerndsCookieInfoDismissed"])
  const [visible, setVisible] = useState(!Boolean(cookies.oerndsCookieInfoDismissed))

  const onDismissCookieInfo = () => {
    setCookie("oerndsCookieInfoDismissed", true, {
      path: PUBLIC_BASE_PATH,
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
        {privacyPolicyLink !== undefined && (
          <>
            {" "}
            <a href={privacyPolicyLink} target="_blank" rel="noopener noreferrer">
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

const CookieNotice = () => {
  return (
    <CookiesProvider>
      <CookieInfo />
    </CookiesProvider>
  )
}

export default CookieNotice
