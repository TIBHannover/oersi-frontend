import React from "react"
import "./ErrorComponent.css"
import {withTranslation} from "react-i18next"
import LinkComponent from "../linkComponent/LinkComponent"

/**
 * Error Component
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @param {*} props properties
 */

const ErrorComponent = (props) => {
  return (
    <>
      <div className="err-info">
        contact us :
        <LinkComponent
          data={"mailto:edmond.kacaj@tib.eu?subject=Mail from Our Site "}
        >
          <span>email</span>
        </LinkComponent>
        <LinkComponent data={"tel:015257484208"}>
          <span>phone</span>
        </LinkComponent>
      </div>

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
