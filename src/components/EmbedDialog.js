import React from "react"
import {useTranslation} from "next-i18next"
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
  useTheme,
  Box,
  TextField,
} from "@mui/material"

import {getHtmlEmbedding} from "../helpers/embed-helper"

const EmbedDialog = (props) => {
  const theme = useTheme()
  const {t} = useTranslation()
  const {onClose, open, data} = props
  const htmlEmbedding = getHtmlEmbedding(data, t)
  const [activeTabIndex, setActiveTabIndex] = React.useState(0)
  const onTabChange = (event, newValue) => {
    setActiveTabIndex(newValue)
  }
  const [copiedToClipboard, setCopiedToClipboard] = React.useState(false)
  function copyCodeToClipboard() {
    typeof window !== "undefined" && navigator.clipboard.writeText(htmlEmbedding)
    setCopiedToClipboard(true)
  }
  function isCopySupported() {
    return typeof window !== "undefined" ? navigator.clipboard : false
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
      <DialogTitle id="embed-dialog-title">
        <Typography variant="h5" component="div">
          {t("EMBED_MATERIAL.DIALOG_TITLE")}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Paper sx={{paddingX: theme.spacing(1.5)}} variant="outlined">
          <Tabs
            value={activeTabIndex}
            onChange={onTabChange}
            aria-label="tabs example"
            indicatorColor="primary"
            textColor="inherit"
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
          <Box sx={{marginY: theme.spacing(1)}} className="embed-dialog-content">
            <TabPanel
              className="embed-dialog-tabpanel"
              index={0}
              activeTabIndex={activeTabIndex}
              ariaLabel="preview"
              sx={{width: "100%", minHeight: "130px"}}
            >
              {parse(htmlEmbedding)}
            </TabPanel>
            <TabPanel
              className="embed-dialog-tabpanel embed-dialog-tabpanel-code"
              index={1}
              activeTabIndex={activeTabIndex}
              ariaLabel="code"
              sx={{width: "100%", minHeight: "130px"}}
            >
              <TextField
                multiline
                className="embed-dialog-textarea"
                readOnly={true}
                inputProps={{readOnly: true}}
                maxRows={10}
                value={htmlEmbedding}
                sx={{width: "100%"}}
              />
            </TabPanel>
          </Box>
          {isCopySupported() && (
            <>
              <Divider />
              <Box
                className="embed-dialog-content-buttons"
                sx={{display: "flex", justifyContent: "flex-end"}}
              >
                <Button
                  color={"primary"}
                  sx={{margin: theme.spacing(1)}}
                  className={
                    "embed-dialog-copy-button" +
                    (copiedToClipboard ? " embed-dialog-copy-done-button" : "")
                  }
                  onClick={copyCodeToClipboard}
                  variant="outlined"
                  disableElevation={true}
                >
                  {copiedToClipboard ? t("LABEL.COPY_DONE") : t("LABEL.COPY")}
                </Button>
              </Box>
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
