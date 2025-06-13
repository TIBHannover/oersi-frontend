import React, {useState} from "react"
import {Trans, useTranslation} from "react-i18next"
import Alert from "react-bootstrap/Alert"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Fade from "react-bootstrap/Fade"
import FloatingLabel from "react-bootstrap/FloatingLabel"
import Form from "react-bootstrap/Form"
import Spinner from "react-bootstrap/Spinner"
import Stack from "react-bootstrap/Stack"
import {useLocation} from "react-router"
import ErrorInfo from "../components/ErrorInfo"
import {concatPaths, useLanguageSpecificPrivacyPolicyLink} from "../helpers/helpers"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import {submitContactRequest} from "../api/backend/contact"

const Contact = (props) => {
  const {t} = useTranslation()
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const privacyPolicyLink = useLanguageSpecificPrivacyPolicyLink()
  const [isPolicyCheckboxChecked, setPolicyCheckboxChecked] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isSuccessfullySubmitted, setSuccessfullySubmitted] = useState(false)
  const [error, setError] = useState(null)
  const location = useLocation()
  const [subject] = useState(
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
      const recordUrl = concatPaths(
        concatPaths(frontendConfig.PUBLIC_URL, frontendConfig.routes.DETAILS_BASE),
        location.state.reportRecordId
      )
      params["message"] = "record: " + recordUrl + "\n\n" + params["message"]
      params["subject"] = "Report record: " + location.state.reportRecordName
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
    <div className="container my-3">
      {error && <ErrorInfo {...error} />}
      {!error && (
        <Card>
          <Card.Body>
            <Card.Title className={"mb-3"} as="h3">
              {t("CONTACT.TITLE")}
            </Card.Title>
            {isSuccessfullySubmitted ? (
              <Alert variant="info" aria-label="success-message">
                {t("CONTACT.SUBMITTED_MESSAGE")}
              </Alert>
            ) : (
              <Form onSubmit={handleSubmit}>
                <FloatingLabel
                  label={t("CONTACT.MAIL_LABEL") + "*"}
                  className="mb-3"
                  controlId="contact-mail-input"
                >
                  <Form.Control
                    required
                    name="email"
                    type="email"
                    placeholder={t("CONTACT.MAIL_LABEL") + "*"}
                  />
                </FloatingLabel>
                {getSubjectInput()}
                <Form.Group className="mb-4" controlId="contact-message-input">
                  <Form.Label>{t("CONTACT.MESSAGE_LABEL")}*</Form.Label>
                  <Form.Control required name="message" as="textarea" rows={6} />
                </Form.Group>
                <Form.Check
                  className="mb-3"
                  type="checkbox"
                  id={"contact-privacy-checkbox"}
                  onChange={(event) =>
                    setPolicyCheckboxChecked(event.target.checked)
                  }
                  label={
                    <Trans
                      i18nKey="CONTACT.READ_PRIVACY_POLICY"
                      components={[
                        <a
                          key="first"
                          href={privacyPolicyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Privacy Policy
                        </a>,
                      ]}
                    />
                  }
                />
                <Stack direction="horizontal" gap={3}>
                  <Button
                    disabled={!isPolicyCheckboxChecked || isLoading}
                    key="contact-submit-button"
                    type="submit"
                  >
                    {t("LABEL.SUBMIT")}
                  </Button>
                  <Fade in={isLoading} mountOnEnter unmountOnExit>
                    <Spinner animation="border" />
                  </Fade>
                </Stack>
              </Form>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  )

  function getSubjectInput() {
    let disabled = false
    let defaultValueSubject
    if (location.state?.reportRecordId) {
      disabled = true
      defaultValueSubject =
        t("CONTACT.TOPIC_REPORT_RECORD") + ": " + location.state.reportRecordName
    }
    return (
      <FloatingLabel
        label={t("CONTACT.SUBJECT_LABEL") + "*"}
        className="mb-3"
        controlId="contact-subject-input"
      >
        <Form.Control
          required
          name="subject"
          type="subject"
          disabled={disabled}
          value={defaultValueSubject}
          placeholder={t("CONTACT.SUBJECT_LABEL") + "*"}
        />
      </FloatingLabel>
    )
  }
}

export default Contact
