import React from "react"
import "../styles/components/searchIndexView.css"
import ResultComponent from "./resultComponent/ResultComponent"
import HeaderComponent from "./headerComponent/HeaderComponent"
import {withTranslation} from "react-i18next"
import FiltersComponent from "./filtersComponent/FiltersComponent"
import FilterListIcon from "@material-ui/icons/FilterList"
import Button from "@material-ui/core/Button"

const ToggleFilterButton = (props) => {
  return (
    <Button
      size="small"
      aria-label="toggle filters"
      className="toggle-filter-button"
      onClick={() => {
        props.toggleShowFilterButton()
      }}
      startIcon={<FilterListIcon />}
    >
      {props.showFilter
        ? props.t("FILTER.HIDE_FILTER")
        : props.t("FILTER.SHOW_FILTER")}
    </Button>
  )
}

const SearchIndexView = (props) => {
  const [showFilter, setShowFilter] = React.useState(
    props.showFilter ? props.showFilter : true
  )
  const toggleShowFilterButton = () => {
    setShowFilter(!showFilter)
  }

  return (
    <>
      <HeaderComponent />
      <div
        className={
          "sub-container ml-3 mr-3" +
          (props.isMobile ? " flex-direction-column" : "")
        }
      >
        <FiltersComponent
          key="sidebar"
          identifier="sidebar"
          multilist={props.multilist}
          className={
            (props.isMobile ? "" : "left-bar ") +
            (showFilter ? "show" : "hide") +
            " ml-3 mr-3 mb-3"
          }
        />
        <div className="result-container">
          <ResultComponent
            buttons={
              <ToggleFilterButton
                showFilter={showFilter}
                toggleShowFilterButton={toggleShowFilterButton}
                {...props}
              />
            }
          />
        </div>
      </div>
    </>
  )
}

export default withTranslation(["translation", "lrt", "subject"])(SearchIndexView)
export {SearchIndexView, ToggleFilterButton}
