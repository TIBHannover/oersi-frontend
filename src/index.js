import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import * as serviceWorker from "./serviceWorker"
import {registerConfiguration} from "./config/configurationData"
import Configuration from "./components/configuration/Configuration"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ConfigurationCss from "./components/configurationCss/Configuration-Css"

registerConfiguration()

ReactDOM.render(
  <div>
    <ConfigurationCss />
    <ToastContainer
      style={{with: "500px", backgroundColor: "Transparent"}}
      autoClose={2000}
      position="top-right"
      className="toast-container"
      toastClassName="dark-toast"
    />
    <Configuration />
  </div>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
