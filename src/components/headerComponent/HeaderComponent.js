import React from "react"
import "./headerComponent.css"
import {withTranslation} from "react-i18next"

/**
 * HeaderComponent
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @param {*} props properties
 */
const HeaderComponent = (props) => {
  return (
    <header>
      <div>
        <h1>
          <b>{props.t("HEADER.TITLE")}</b>
        </h1>
        <p>
          <b>{props.t("HEADER.SUBTITLE")}</b>
        </p>
      </div>
      {props.children}
    </header>
  )
}

export default withTranslation()(HeaderComponent)
