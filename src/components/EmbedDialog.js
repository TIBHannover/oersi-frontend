import React from "react"
import {useTranslation} from "react-i18next"
import parse from "html-react-parser"
import Button from "react-bootstrap/Button"
import FormControl from "react-bootstrap/FormControl"
import Modal from "react-bootstrap/Modal"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"

import {getHtmlEmbedding} from "../helpers/embed-helper"

const EmbedDialog = (props) => {
  const {t} = useTranslation()
  const {onClose, open, data} = props
  const htmlEmbedding = getHtmlEmbedding(data, t)
  const [copiedToClipboard, setCopiedToClipboard] = React.useState(false)
  function copyCodeToClipboard() {
    navigator.clipboard.writeText(htmlEmbedding)
    setCopiedToClipboard(true)
  }
  function isCopySupported() {
    return navigator.clipboard
  }

  return (
    <Modal
      show={open}
      onHide={onClose}
      size="xl"
      fullscreen="md-down"
      centered={true}
      aria-labelledby="embed-dialog-title"
    >
      <Modal.Header>
        <Modal.Title id="embed-dialog-title">
          <div className="">{t("EMBED_MATERIAL.DIALOG_TITLE")}</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs
          aria-label="embed-dialog-tabs"
          indicatorColor="primary"
          textColor="inherit"
        >
          <Tab
            className="py-1 embed-dialog-tab-preview"
            title={t("EMBED_MATERIAL.PREVIEW")}
            eventKey="embed-dialog-tab-preview"
          >
            <div>{parse(htmlEmbedding)}</div>
          </Tab>
          <Tab
            className="py-1 embed-dialog-tab-code"
            title={t("EMBED_MATERIAL.CODE")}
            eventKey="embed-dialog-tab-code"
          >
            <FormControl
              as="textarea"
              className="embed-dialog-textarea"
              readOnly={true}
              rows="12"
              value={htmlEmbedding}
            />
          </Tab>
        </Tabs>
        {isCopySupported() && (
          <div className="embed-dialog-content-buttons d-flex justify-content-end">
            <Button
              className={
                "m-2 embed-dialog-copy-button" +
                (copiedToClipboard ? " embed-dialog-copy-done-button" : "")
              }
              onClick={copyCodeToClipboard}
              variant="outline-primary"
            >
              {copiedToClipboard ? t("LABEL.COPY_DONE") : t("LABEL.COPY")}
            </Button>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} color="primary">
          {t("LABEL.CLOSE")}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EmbedDialog
