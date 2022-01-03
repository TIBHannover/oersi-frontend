import React from "react"
import {useTranslation} from "react-i18next"
import parse from "html-react-parser"
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Divider,
  Paper,
  Tabs,
  Tab,
  Typography,
} from "@material-ui/core"

import "./EmbedDialog.css"
import {getHtmlEmbedding} from "../helpers/embed-helper"

const EmbedDialog = (props) => {
  const {t} = useTranslation()
  const {onClose, open, data} = props
  const htmlEmbedding = getHtmlEmbedding(data, t)
  const [activeTabIndex, setActiveTabIndex] = React.useState(0)
  const onTabChange = (event, newValue) => {
    setActiveTabIndex(newValue)
  }
  const [copiedToClipboard, setCopiedToClipboard] = React.useState(false)
  function copyCodeToClipboard() {
    navigator.clipboard.writeText(htmlEmbedding)
    setCopiedToClipboard(true)
  }
  function isCopySupported() {
    return navigator.clipboard
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth={true}
      aria-labelledby="embed-dialog-title"
      TransitionProps={{unmountOnExit: true, mountOnEnter: true}}
    >
      <DialogTitle id="embed-dialog-title" disableTypography={true}>
        <Typography variant="h5">{t("EMBED_MATERIAL.DIALOG_TITLE")}</Typography>
      </DialogTitle>
      <DialogContent>
        <Paper className="pl-3 pr-3" variant="outlined">
          <Tabs
            value={activeTabIndex}
            onChange={onTabChange}
            aria-label="tabs example"
          >
            <Tab
              className="embed-dialog-tab-preview"
              label={t("EMBED_MATERIAL.PREVIEW")}
            />
            <Tab
              className="embed-dialog-tab-code"
              label={t("EMBED_MATERIAL.CODE")}
            />
          </Tabs>
          <Divider />
          <div className="mt-2 mb-2 embed-dialog-content">
            <TabPanel
              className="embed-dialog-tabpanel"
              index={0}
              activeTabIndex={activeTabIndex}
              ariaLabel="preview"
            >
              {parse(htmlEmbedding)}
            </TabPanel>
            <TabPanel
              className="embed-dialog-tabpanel embed-dialog-tabpanel-code"
              index={1}
              activeTabIndex={activeTabIndex}
              ariaLabel="code"
            >
              <textarea
                className="embed-dialog-textarea"
                readOnly={true}
                rows={5}
                value={htmlEmbedding}
              />
            </TabPanel>
          </div>
          {isCopySupported() && (
            <>
              <Divider />
              <div className="embed-dialog-content-buttons">
                <Button
                  color={"primary"}
                  className={
                    "m-2 embed-dialog-copy-button" +
                    (copiedToClipboard ? " embed-dialog-copy-done-button" : "")
                  }
                  onClick={copyCodeToClipboard}
                  variant="outlined"
                  disableElevation={true}
                >
                  {copiedToClipboard ? t("LABEL.COPY_DONE") : t("LABEL.COPY")}
                </Button>
              </div>
            </>
          )}
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t("LABEL.CLOSE")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
const TabPanel = (props) => {
  const {children, index, activeTabIndex, ariaLabel} = props
  return (
    <div
      className={props.className}
      role="tabpanel"
      hidden={activeTabIndex !== index}
      id={`embed-dialog-tabpanel-${index}`}
      aria-labelledby={`embed-dialog-tabpanel-${index}`}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  )
}

export default EmbedDialog