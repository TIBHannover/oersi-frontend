import React from "react"
import "./EmbedDialog.css"
import {withTranslation} from "react-i18next"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import Typography from "@material-ui/core/Typography"
import {getHtmlEmbedding} from "../../helpers/embed-helper"

const EmbedDialog = (props) => {
  const {onClose, open, data} = props
  const textAreaRef = React.useRef(null)
  const [copiedToClipboard, setCopiedToClipboard] = React.useState(false)
  const copyCodeToClipboard = () => {
    textAreaRef.current && textAreaRef.current.select()
    document.execCommand("copy")
    setCopiedToClipboard(true)
  }
  function isCopySupported() {
    return document.queryCommandSupported && document.queryCommandSupported("copy")
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={true}
      aria-labelledby="embed-dialog-title"
      TransitionProps={{unmountOnExit: true, mountOnEnter: true}}
    >
      <DialogTitle id="embed-dialog-title" disableTypography={true}>
        <Typography variant="h5">
          {props.t("EMBED_MATERIAL.DIALOG_TITLE")}
        </Typography>
      </DialogTitle>
      <DialogContent className="embed-dialog-content">
        <textarea
          className="embed-dialog-textarea"
          ref={textAreaRef}
          readOnly={true}
          rows={5}
          value={getHtmlEmbedding(data, props.t)}
        />
        {isCopySupported() && (
          <Button
            color={"primary"}
            className={
              "ml-4 embed-dialog-copy-button" +
              (copiedToClipboard ? " embed-dialog-copy-done-button" : "")
            }
            onClick={copyCodeToClipboard}
            variant="outlined"
            disableElevation={true}
          >
            {copiedToClipboard ? props.t("LABEL.COPY_DONE") : props.t("LABEL.COPY")}
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {props.t("LABEL.CLOSE")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default withTranslation()(EmbedDialog)
