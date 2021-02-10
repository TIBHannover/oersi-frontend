import React from "react"
import "../styles/components/searchIndexView.css"
import ResultComponent from "./resultComponent/ResultComponent"
import HeaderComponent from "./headerComponent/HeaderComponent"
import MultiDropDownComponent from "./multiDropDownComponent/MultiDropDownComponent"
import MultiListComponent from "./multiListComponent/MultiListComponent"
import {withTranslation} from "react-i18next"
import SelectedFiltersComponent from "./filtersComponent/SelectedFiltersComponent"

const SearchIndexView = (props) => {
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

export default withTranslation(["translation", "lrt", "subject"])(SearchIndexView)
