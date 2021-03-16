import React, {useState} from "react"
import "../styles/components/searchIndexView.css"
import ResultComponent from "./resultComponent/ResultComponent"
import HeaderComponent from "./headerComponent/HeaderComponent"
import {withTranslation} from "react-i18next"
import FiltersComponent from "./filtersComponent/FiltersComponent"
import SelectedFiltersComponent from "./filtersComponent/SelectedFiltersComponent"
import FilterListIcon from "@material-ui/icons/FilterList"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import Fade from "@material-ui/core/Fade"
import Typography from "@material-ui/core/Typography"

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

const ResultStatsComponent = (props) => {
  return (
    <div className="render-result">
      <Typography variant="h6">
        {props.isLoading
          ? ""
          : props
              .t("RESULT_LIST.SHOW_RESULT_STATS")
              .replace("_result_", props.totalResult)}{" "}
        <Fade in={props.isLoading}>
          <CircularProgress color="inherit" size={16} />
        </Fade>
      </Typography>
    </div>
  )
}

const SearchIndexView = (props) => {
  const [totalResult, setTotalResult] = useState(0)
  const [isLoading, setLoading] = useState(false)
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
        <div
          className={
            (props.isMobile ? "" : "filter-sidebar ") +
            (showFilter ? "show" : "hide") +
            " ml-3 mr-3 mb-3"
          }
        >
          <div className="buttons mb-3">
            <ToggleFilterButton
              showFilter={showFilter}
              toggleShowFilterButton={toggleShowFilterButton}
              {...props}
            />
          </div>
          <FiltersComponent
            key="sidebar"
            identifier="sidebar"
            multilist={props.multilist}
          />
        </div>
        <div className="result-container">
          <div className="result-stat-line ml-3 mr-3">
            <div className={`buttons mr-3 ${showFilter ? "hide" : "show"}`}>
              <ToggleFilterButton
                showFilter={showFilter}
                toggleShowFilterButton={toggleShowFilterButton}
                {...props}
              />
            </div>
            <ResultStatsComponent
              isLoading={isLoading}
              totalResult={totalResult}
              {...props}
            />
            <SelectedFiltersComponent />
          </div>
          <ResultComponent
            setLoading={setLoading}
            totalResult={totalResult}
            setTotalResult={setTotalResult}
          />
        </div>
      </div>
    </>
  )
}

export default withTranslation(["translation", "lrt", "subject"])(SearchIndexView)
export {SearchIndexView, ToggleFilterButton}
