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
        <h1>{props.t("HEADER.TITLE")}</h1>
        <p>{props.t("HEADER.SUBTITLE")}</p>
      </div>
      {props.children}
    </header>
  )
}

export default withTranslation()(HeaderComponent)
