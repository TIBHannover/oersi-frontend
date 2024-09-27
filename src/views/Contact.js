import React, {useState} from "react"
import {Trans, useTranslation} from "next-i18next"
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Fade,
  FormControlLabel,
  Link,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import ErrorInfo from "../components/ErrorInfo"
import {getPrivacyPolicyLinkForLanguage} from "../helpers/helpers"
import SearchIndexFrontendConfigContext from "../helpers/SearchIndexFrontendConfigContext"
import {submitContactRequest} from "../api/backend/contact"
import {useRouter} from "next/router"

const Contact = (props) => {
  const theme = useTheme()
  const {t, i18n} = useTranslation()
  const {PRIVACY_POLICY_LINK, PUBLIC_URL} = React.useContext(
    SearchIndexFrontendConfigContext
  )
  const [isPolicyCheckboxChecked, setPolicyCheckboxChecked] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isSuccessfullySubmitted, setSuccessfullySubmitted] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const [subject] = useState(
    router.query && router.query.reportRecordId ? "Report record" : null
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.target)
    let params = {}
    for (let e of data.entries()) {
      params[e[0]] = e[1]
    }
    if (subject === "Report record") {
      const recordUrl = PUBLIC_URL + "/" + router.query.reportRecordId
      params["message"] = "record: " + recordUrl + "\n\n" + params["message"]
      params["subject"] = "Report record: " + router.query.reportRecordName
    }
    setLoading(true)
    submitContactRequest(JSON.stringify(params))
      .then(() => {
        setLoading(false)
        setSuccessfullySubmitted(true)
      })
      .catch((err) => {
        console.error(err)
        setError(err)
        setLoading(false)
      })
  }

  return (
    <Container>
      {error && <ErrorInfo {...error} />}
      {!error && (
        <Paper>
          <Box p={3}>
            <Typography variant="h3" component="h1" color="textPrimary" paragraph>
              {t("CONTACT.TITLE")}
            </Typography>
            {isSuccessfullySubmitted ? (
              <Typography
                aria-label="success-message"
                variant="h5"
                component="div"
                color="textPrimary"
                paragraph
              >
                {t("CONTACT.SUBMITTED_MESSAGE")}
              </Typography>
            ) : (
              <form onSubmit={handleSubmit}>
                <Box pb={2}>
                  <TextField
                    fullWidth
                    required
                    name="email"
                    id="contact-mail-input"
                    label={t("CONTACT.MAIL_LABEL")}
                    variant="outlined"
                    type="email"
                  />
                </Box>
                {getSubjectInput()}
                <Box pb={2}>
                  <TextField
                    fullWidth
                    required
                    name="message"
                    id="contact-message-input"
                    label={t("CONTACT.MESSAGE_LABEL")}
                    multiline
                    rows={6}
                    variant="outlined"
                  />
                </Box>
                <Box pb={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="contact-privacy-checkbox"
                        checked={isPolicyCheckboxChecked}
                        onChange={(event) =>
                          setPolicyCheckboxChecked(event.target.checked)
                        }
                      />
                    }
                    label={
                      <Trans
                        i18nKey="CONTACT.READ_PRIVACY_POLICY"
                        components={[
                          <Link
                            href={getPrivacyPolicyLinkForLanguage(
                              PRIVACY_POLICY_LINK,
                              i18n?.language,
                              i18n?.languages
                            )}
                            target="_blank"
                            key="1"
                            rel="noopener noreferrer"
                            underline="hover"
                          >
                            Privacy Policy
                          </Link>,
                        ]}
                      />
                    }
                  />
                </Box>
                <div style={{display: "flex", alignItems: "center"}}>
                  <Button
                    disabled={!isPolicyCheckboxChecked || isLoading}
                    variant="contained"
                    color="primary"
                    size="large"
                    key="contact-submit-button"
                    type="submit"
                  >
                    {t("LABEL.SUBMIT")}
                  </Button>
                  <Fade in={isLoading} mountOnEnter unmountOnExit>
                    <CircularProgress
                      sx={{ml: theme.spacing(1)}}
                      color="inherit"
                      size={24}
                    />
                  </Fade>
                </div>
              </form>
            )}
          </Box>
        </Paper>
      )}
    </Container>
  )

  function getSubjectInput() {
    let disabled = false
    let defaultValueSubject = undefined
    if (router.query && router.query.reportRecordId) {
      disabled = true
      defaultValueSubject =
        t("CONTACT.TOPIC_REPORT_RECORD") + ": " + router.query.reportRecordName
    }
    return (
      <>
        <Box pb={2}>
          <TextField
            fullWidth
            disabled={disabled}
            value={defaultValueSubject}
            required
            name="subject"
            id="contact-subject-input"
            label={t("CONTACT.SUBJECT_LABEL")}
            variant="outlined"
          />
        </Box>
      </>
    )
  }
}

export default Contact
