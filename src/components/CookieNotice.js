import React, {useState} from "react"
import {useCookies} from "react-cookie"
import {useTranslation} from "react-i18next"

import {OersiConfigContext} from "../helpers/use-context"
import {getPrivacyPolicyLinkForLanguage} from "../helpers/helpers"
import {Box, Button, Fade, Link, useTheme} from "@mui/material"

/**
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @param {*} props properties
 */
const CookieNotice = (props) => {
  const theme = useTheme()
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
    <Fade in={visible}>
      <Box
        id="cookieConsent"
        aria-label="cookieConsent"
        sx={{
          position: "fixed",
          zIndex: "1500",
          bottom: "0",
          width: "100%",
          textAlign: "center",
          padding: theme.spacing(2),
          backgroundColor: "#333",
          color: "#fff",
        }}
      >
        {t("COOKIE.TITLE")}
        {getPrivacyPolicyLinkForLanguage(
          PRIVACY_POLICY_LINK,
          i18n.language,
          i18n.languages
        ) !== undefined && (
          <>
            {" "}
            <Link
              href={getPrivacyPolicyLinkForLanguage(
                PRIVACY_POLICY_LINK,
                i18n.language,
                i18n.languages
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("COOKIE.MORE_INFO")}
            </Link>
          </>
        )}
        <Button
          onClick={onDismissCookieInfo}
          className="cookieConsentOK"
          variant="contained"
          sx={{marginLeft: theme.spacing(2)}}
        >
          {t("COOKIE.BUTTON_ACCEPT")}
        </Button>
      </Box>
    </Fade>
  )
}

export default CookieNotice
