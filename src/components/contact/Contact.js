import React, {useState} from "react"
import i18next from "i18next"
import {Trans, withTranslation} from "react-i18next"
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Fade,
  FormControl,
  FormControlLabel,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core"
import {useLocation} from "react-router-dom"
import ErrorInfo from "../ErrorInfo"
import {getPrivacyPolicyLinkForLanguage} from "../../helpers/helpers"
import {ConfigurationRunTime} from "../../helpers/use-context"
import {submitContactRequest} from "../../service/backend/contact"

const Contact = (props) => {
  const {PRIVACY_POLICY_LINK, PUBLIC_URL} = React.useContext(ConfigurationRunTime)
  const [isPolicyCheckboxChecked, setPolicyCheckboxChecked] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isSuccessfullySubmitted, setSuccessfullySubmitted] = useState(false)
  const [error, setError] = useState(null)
  const location = useLocation()
  const [subject, setSubject] = useState(
    location.state && location.state.reportRecordId ? "Report record" : null
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.target)
    let params = {}
    for (let e of data.entries()) {
      params[e[0]] = e[1]
    }
    if (subject === "Report record") {
      const recordUrl = PUBLIC_URL + "/" + location.state.reportRecordId
      params["message"] = "record: " + recordUrl + "\n\n" + params["message"]
      params["subject"] = params["subject"] + ": " + location.state.reportRecordName
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
              {props.t("CONTACT.TITLE")}
            </Typography>
            {isSuccessfullySubmitted ? (
              <Typography
                data-testid="contact-success-message"
                variant="h5"
                component="div"
                color="textPrimary"
                paragraph
              >
                {props.t("CONTACT.SUBMITTED_MESSAGE")}
              </Typography>
            ) : (
              <form onSubmit={handleSubmit}>
                <Box pb={2}>
                  <TextField
                    fullWidth
                    required
                    name="email"
                    id="contact-mail-input"
                    data-testid="contact-mail-input"
                    label={props.t("CONTACT.MAIL_LABEL")}
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
                    data-testid="contact-message-input"
                    label={props.t("CONTACT.MESSAGE_LABEL")}
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
                        data-testid="contact-privacy-checkbox"
                        color="default"
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
                              i18next.language,
                              i18next.languages
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
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
                    variant="outlined"
                    size="large"
                    key="contact-submit-button"
                    type="submit"
                    data-testid="contact-submit-button"
                  >
                    {props.t("LABEL.SUBMIT")}
                  </Button>
                  <Fade in={isLoading} mountOnEnter unmountOnExit>
                    <CircularProgress className="ml-2" color="inherit" size={24} />
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
    let defaultValue = undefined
    let subjectOptions = [
      {value: "General question", labelKey: "CONTACT.SUBJECT_GENERAL"},
      {value: "Add new source", labelKey: "CONTACT.SUBJECT_NEW_SOURCE"},
    ]
    if (location.state && location.state.reportRecordId) {
      disabled = true
      defaultValue = "Report record"
      subjectOptions = [
        ...subjectOptions,
        {
          value: "Report record",
          labelKey: "CONTACT.SUBJECT_REPORT_RECORD",
          suffix: ": " + location.state.reportRecordName,
        },
      ]
    }
    return (
      <Box pb={2}>
        <FormControl fullWidth required variant="outlined" disabled={disabled}>
          <InputLabel id="contact-subject-input-label">
            {props.t("CONTACT.SUBJECT_LABEL")}
          </InputLabel>
          <Select
            labelId="contact-subject-input-label"
            id="contact-subject-input"
            data-testid="contact-subject-input"
            inputProps={{name: "subject"}}
            label={props.t("CONTACT.SUBJECT_LABEL") + " *"}
            value={defaultValue}
            onChange={(e) => setSubject(e.target.value)}
          >
            {getSelectMenuItems(subjectOptions, props)}
          </Select>
        </FormControl>
      </Box>
    )
  }
}

function getSelectMenuItems(options, props) {
  return options.map((option) => {
    return (
      <MenuItem key={`contact-subject-${option.value}`} value={option.value}>
        {props.t(option.labelKey) + (option.suffix ? option.suffix : "")}
      </MenuItem>
    )
  })
}

export default withTranslation()(Contact)
