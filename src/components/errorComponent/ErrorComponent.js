import React from "react"
import "./ErrorComponent.css"
import {withTranslation} from "react-i18next"

/**
 * Error Component
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @param {*} props properties
 */

const ErrorComponent = (props) => {
  return (
    <>
      <div className="err-box">
        <div>
          {props.t("ERROR.TITLE")} <b>404 !</b>{" "}
        </div>
        <p>
          <span></span> {props.t("ERROR.MESSAGE")}
        </p>
      </div>
    </>
  )
}

export default withTranslation()(ErrorComponent)
