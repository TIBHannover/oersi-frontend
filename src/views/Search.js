import React, {useState} from "react"
import config from "react-global-configuration"
import {useTranslation} from "react-i18next"
import {Helmet} from "react-helmet"
import FilterListIcon from "@material-ui/icons/FilterList"
import {Button, CircularProgress, Fade, Typography} from "@material-ui/core"

import "./Search.css"
import {OersiConfigContext} from "../helpers/use-context"
import Filters from "../components/Filters"
import SearchResultList from "../components/SearchResultList"
import SelectedFilters from "../components/SelectedFilters"

const ToggleFilterButton = (props) => {
  const {t} = useTranslation()
  return (
    <Button
      size="small"
      aria-label="toggle filters"
      className="toggle-filter-button"
      onClick={props.onToggleShowFilterButton}
      startIcon={<FilterListIcon />}
    >
      {props.showFilter ? t("FILTER.HIDE_FILTER") : t("FILTER.SHOW_FILTER")}
    </Button>
  )
}

const ResultStats = (props) => {
  const {t} = useTranslation()
  return (
    <div className="render-result">
      <Typography variant="h6">
        {props.isLoading
          ? ""
          : t("RESULT_LIST.SHOW_RESULT_STATS", {
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
  const {t} = useTranslation()
  const [multiList] = useState(config.get("multiList"))
  const oersiConfig = React.useContext(OersiConfigContext)
  const [totalResult, setTotalResult] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const [showFilter, setShowFilter] = React.useState(
    props.showFilter ? props.showFilter : true
  )

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
              name: t("META.TITLE"),
              description: t("META.DESCRIPTION"),
              url: oersiConfig.PUBLIC_URL,
              potentialAction: {
                "@type": "SearchAction",
                target:
                  oersiConfig.PUBLIC_URL + "/?search=%22{search_term_string}%22",
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
        multilist={multiList}
        className={
          (props.isMobile ? "" : "left-bar ") +
          (showFilter ? "show" : "hide") +
          " ml-3 mr-3 mb-3"
        }
      />
      <div className="result-container">
        <div className="result-stat-line ml-3 mr-3">
          <ResultStats isLoading={isLoading} totalResult={totalResult} {...props} />
          <div className="buttons ml-auto">
            <ToggleFilterButton
              showFilter={showFilter}
              onToggleShowFilterButton={() => {
                setShowFilter(!showFilter)
              }}
              {...props}
            />
          </div>
        </div>
        <SelectedFilters />
        <SearchResultList
          onChangeLoading={setLoading}
          totalResult={totalResult}
          onChangeTotalResult={setTotalResult}
        />
      </div>
    </div>
  )
}

export default Search
export {ToggleFilterButton}
