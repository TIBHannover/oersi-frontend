import React, {useState} from "react"
import "./filterComponent.css"
import {withTranslation} from "react-i18next"

/**
 * This is the Filter component,this component is to show the filters,for diferrent view
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @param {*} props properties
 */

const FilterComponent = (props) => {
  const [isClicked, setIsClicked] = useState(false)
  const [message, setMessage] = useState(props.t("FILTER.SHOW_FILTERS"))
  return (
    <div className="sub-container">
      <div className={isClicked ? "left-bar-optional" : "left-bar"}>
        {props.left}
      </div>
      <div className={isClicked ? "result-container-optional" : "result-container"}>
        {props.center}
      </div>
      <div className={isClicked ? "right-bar-optional" : "right-bar"}>
        {props.right}
      </div>

      <button
        className="toggle-button"
        onClick={() => {
          setIsClicked(!isClicked)
          setMessage(
            isClicked
              ? props.t("FILTER.SHOW_FILTERS")
              : props.t("FILTER.SHOW_RESULT")
          )
        }}
      >
        {message}
      </button>
    </div>
  )
}

export default withTranslation()(FilterComponent)
