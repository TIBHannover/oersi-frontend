import React from "react"
import "./filterComponent.css"
import ResultComponent from "../resultComponent/ResultComponent"
import HeaderComponent from "../headerComponent/HeaderComponent"
import MultiDropDownComponent from "../multiDropDownComponent/MultiDropDownComponent"
import MultiListComponent from "../multiListComponent/MultiListComponent"
import {withTranslation} from "react-i18next"
import SelectedFiltersComponent from "./SelectedFiltersComponent"

/**
 * This is the Filter component,this component is to show the filters,for diferrent view
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @param {*} props properties
 */

const FilterComponent = (props) => {
  return (
    <>
      <HeaderComponent isMobile={props.isMobile}>
        {/* TODO consider using Hidden: https://material-ui.com/components/hidden/ */}
        {props.multilist.map((list, index) => (
          <MultiDropDownComponent isMobile={props.isMobile} key={index} {...list} />
        ))}
      </HeaderComponent>
      <div className="sub-container ml-3 mr-3">
        {
          <div
            className={
              "left-bar left-bar-" +
              (props.isMobile ? "hide" : "show") +
              " ml-2 mr-3"
            }
          >
            {props.multilist.map((list, index) => (
              <MultiListComponent isMobile={props.isMobile} key={index} {...list} />
            ))}
          </div>
        }
        <div className="result-container">
          <SelectedFiltersComponent />
          <ResultComponent />
        </div>
      </div>
    </>
  )
}

export default withTranslation(["translation", "lrt", "subject"])(FilterComponent)
