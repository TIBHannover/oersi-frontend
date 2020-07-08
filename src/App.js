import React, {useState} from "react"
import {ReactiveBase} from "@appbaseio/reactivesearch"
import "./App.css"
import FooterComponent from "./components/footerComponent/FooterComponent"
import FilterComponent from "./components/filterComponent/FilterComponent"
import {isTablet, isIPad13, isIPod13, isMobile} from "react-device-detect"

const App = (props) => {
  const [multilist] = useState(props.config.get("multiList"))

  return (
    <div className="wrapper">
      <ReactiveBase
        className="reactive-base"
        app={props.data.APP_NAME}
        url={props.data.URL}
        headers={checkIfExeistCredencial(props.data.CREDENCIAL)}
      >
        <FilterComponent isMobile={checkScreenDevice()} multilist={multilist} />
        <FooterComponent />
      </ReactiveBase>
    </div>
  )

  /**
   * function to check if exist credencal for Reactive search or not
   * @param {String} credencial
   */
  function checkIfExeistCredencial(credencial) {
    if (credencial !== "" && credencial) return {authorization: credencial}
    else return null
  }

  function checkScreenDevice() {
    return (
      isTablet === true ||
      isIPad13 === true ||
      isIPod13 === true ||
      isMobile === true
    )
  }
}

export default App
