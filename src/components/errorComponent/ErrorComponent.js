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
          link={"mailto:edmond.kacaj@tib.eu?subject=Mail from Our Site "}
        >
          <span>
            <b>email:</b> edmond.kacaj@tib.eu
          </span>
        </LinkComponent>
        <LinkComponent link={"tel:015257484208"}>
          <span>
            <b>email:</b> 015257484208
          </span>
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
