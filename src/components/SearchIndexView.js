import React from "react"
import "../styles/components/searchIndexView.css"
import ResultComponent from "./resultComponent/ResultComponent"
import HeaderComponent from "./headerComponent/HeaderComponent"
import {withTranslation} from "react-i18next"
import FiltersComponent from "./filtersComponent/FiltersComponent"
import SelectedFiltersComponent from "./filtersComponent/SelectedFiltersComponent"

const SearchIndexView = (props) => {
  return (
    <>
      <HeaderComponent isMobile={props.isMobile}>
        {/* TODO consider using Hidden: https://material-ui.com/components/hidden/ */}
        <FiltersComponent
          key="header"
          identifier="header"
          multilist={props.multilist}
          className={props.isMobile ? "show" : "hide"}
        />
      </HeaderComponent>
      <div className="sub-container ml-3 mr-3">
        <FiltersComponent
          key="sidebar"
          identifier="sidebar"
          multilist={props.multilist}
          className={"left-bar " + (props.isMobile ? "hide" : "show") + " ml-2 mr-3"}
        />
        <div className="result-container">
          <SelectedFiltersComponent />
          <ResultComponent />
        </div>
      </div>
    </>
  )
}

export default withTranslation(["translation", "lrt", "subject"])(SearchIndexView)
