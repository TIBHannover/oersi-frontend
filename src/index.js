import React, {Suspense} from "react"
import {createRoot} from "react-dom/client"
import "./index.css"
import * as serviceWorker from "./serviceWorker"
import {registerConfiguration} from "./config/configurationData"
import Configuration from "./Configuration"
import "./i18n"
import App from "./App"

registerConfiguration()

const root = createRoot(document.getElementById("root"))
root.render(
  <div>
    <Suspense fallback={<div>Loading...</div>}>
      <Configuration>
        <App />
      </Configuration>
    </Suspense>
  </div>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
