import React, {useState} from "react"
import i18next from "i18next"
import {Trans, withTranslation} from "react-i18next"
import {
  Box,
  Button,
  Checkbox,
  Container,
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
import {getPrivacyPolicyLinkForLanguage} from "../../helpers/helpers"
import {ConfigurationRunTime} from "../../helpers/use-context"

const Contact = (props) => {
  const {PRIVACY_POLICY_LINK} = React.useContext(ConfigurationRunTime)
  const [isPolicyCheckboxChecked, setPolicyCheckboxChecked] = useState(false)

  return (
    <Container>
      <Paper>
        <Box p={3}>
          <Typography variant="h3" component="h1" color="textPrimary" paragraph>
            {props.t("CONTACT.TITLE")}
          </Typography>
          <form
            action={process.env.PUBLIC_URL + "/api-internal/contact"}
            method="POST"
          >
            <Box pb={2}>
              <TextField
                fullWidth
                required
                name="email"
                id="contact-mail-input"
                label={props.t("CONTACT.MAIL_LABEL")}
                variant="outlined"
                type="email"
              />
            </Box>
            <Box pb={2}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel id="contact-subject-input-label">
                  {props.t("CONTACT.SUBJECT_LABEL")}
                </InputLabel>
                <Select
                  labelId="contact-subject-input-label"
                  id="contact-subject-input"
                  inputProps={{name: "subject"}}
                  label={props.t("CONTACT.SUBJECT_LABEL") + " *"}
                >
                  <MenuItem value="General question">
                    {props.t("CONTACT.SUBJECT_GENERAL")}
                  </MenuItem>
                  <MenuItem value="Add new source">
                    {props.t("CONTACT.SUBJECT_NEW_SOURCE")}
                  </MenuItem>
                  <MenuItem value="Report record">
                    {props.t("CONTACT.SUBJECT_REPORT_RECORD")}
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box pb={2}>
              <TextField
                fullWidth
                required
                name="message"
                id="contact-message-input"
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
            <Button
              disabled={!isPolicyCheckboxChecked}
              variant="outlined"
              size="large"
              key="contact-submit-button"
              type="submit"
              data-testid="contact-submit-button"
            >
              {props.t("LABEL.SUBMIT")}
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  )
}

export default withTranslation()(Contact)
