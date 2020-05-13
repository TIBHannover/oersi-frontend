import React from "react"
import {getConfiguration} from "../../service/configuration/configurationService"

class ConfigurationCss extends React.Component {
  async componentDidMount() {
    await getConfiguration("/css/style-override.css")
      .then((r) => r.text())
      .then((dat) => {
        if (dat !== "") {
          console.log("Load css override ")
          this.loadExternalStyles(dat)
        }
      })
      .catch((error) => {
        console.log("nothing to load ")
      })
  }

  loadExternalStyles(style) {
    var styleElement = document.createElement("style")
    styleElement.type = "text/css"
    styleElement.className = "custom-style"
    styleElement.innerHTML = style
    document.head.insertBefore(
      styleElement,
      document.head.childNodes[document.head.childNodes.length - 1].nextSibling
    )
  }

  render() {
    return <></>
  }
}

export default ConfigurationCss
