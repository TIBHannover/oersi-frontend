import React, {useState} from "react"
import "./Search.css"
import SearchResultList from "../components/SearchResultList"
import {withTranslation} from "react-i18next"
import {Helmet} from "react-helmet"
import Filters from "../components/Filters"
import SelectedFilters from "../components/SelectedFilters"
import FilterListIcon from "@material-ui/icons/FilterList"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import Fade from "@material-ui/core/Fade"
import Typography from "@material-ui/core/Typography"
import {ConfigurationRunTime} from "../helpers/use-context"

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
          : props.t("RESULT_LIST.SHOW_RESULT_STATS", {
              total: props.totalResult,
            })}{" "}
        <Fade in={props.isLoading} mountOnEnter unmountOnExit>
          <CircularProgress color="inherit" size={16} />
        </Fade>
      </Typography>
    </div>
  )
}

const Search = (props) => {
  const context = React.useContext(ConfigurationRunTime)
  const [totalResult, setTotalResult] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const [showFilter, setShowFilter] = React.useState(
    props.showFilter ? props.showFilter : true
  )
  const toggleShowFilterButton = () => {
    setShowFilter(!showFilter)
  }

  return (
    <div
      className={
        "sub-container ml-3 mr-3" + (props.isMobile ? " flex-direction-column" : "")
      }
    >
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(
            {
              "@context": "https://schema.org/",
              "@type": "WebSite",
              name: props.t("META.TITLE"),
              description: props.t("META.DESCRIPTION"),
              url: context.PUBLIC_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: context.PUBLIC_URL + "/?search=%22{search_term_string}%22",
                "query-input": "name=search_term_string",
              },
            },
            null,
            2
          )}
        </script>
      </Helmet>
      <Filters
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
        <div className="result-stat-line ml-3 mr-3">
          <ResultStatsComponent
            isLoading={isLoading}
            totalResult={totalResult}
            {...props}
          />
          <div className="buttons ml-auto">
            <ToggleFilterButton
              showFilter={showFilter}
              toggleShowFilterButton={toggleShowFilterButton}
              {...props}
            />
          </div>
        </div>
        <SelectedFilters />
        <SearchResultList
          setLoading={setLoading}
          totalResult={totalResult}
          setTotalResult={setTotalResult}
        />
      </div>
    </div>
  )
}

export default withTranslation(["translation", "lrt", "subject"])(Search)
export {Search, ToggleFilterButton}
