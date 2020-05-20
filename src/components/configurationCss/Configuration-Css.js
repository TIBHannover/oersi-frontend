import React from "react"
import {getConfiguration} from "../../service/configuration/configurationService"

class ConfigurationCss extends React.Component {
  async componentDidMount() {
    await getConfiguration("/css/style-override.css")
      .then((r) => r.text())
      .then((dat) => {
        console.log("Load css override ")
        this.loadExternalStyles(dat)
      })
      .catch((error) => {
        console.log("nothing to load ")
      })
  }

  loadExternalStyles(style) {
    var head = document.getElementsByTagName("head")[0]
    var styleElement = document.createElement("style")
    styleElement.type = "text/css"
    styleElement.className = "custom-style"
    styleElement.innerHTML = style !== "" ? style : ""
    head.appendChild(styleElement)
    return true
  }

  render() {
    return <></>
  }
}

export default ConfigurationCss
