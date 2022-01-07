import React, {useState} from "react"
import config from "react-global-configuration"
import {useTranslation} from "react-i18next"
import {Helmet} from "react-helmet"
import FilterListIcon from "@mui/icons-material/FilterList"
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"

import "./Search.css"
import {OersiConfigContext} from "../helpers/use-context"
import Filters from "../components/Filters"
import SearchResultList from "../components/SearchResultList"
import SelectedFilters from "../components/SelectedFilters"

const ToggleFilterButton = (props) => {
  const {t} = useTranslation()
  return (
    <Button
      color="grey"
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
      <Typography variant="h6" sx={{fontWeight: "normal"}}>
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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const {t} = useTranslation()
  const [multiList] = useState(config.get("multiList"))
  const oersiConfig = React.useContext(OersiConfigContext)
  const [totalResult, setTotalResult] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const [showFilter, setShowFilter] = React.useState(
    props.showFilter ? props.showFilter : true
  )

  return (
    <Box
      className={"sub-container" + (isMobile ? " flex-direction-column" : "")}
      sx={{ml: theme.spacing(1.5), mr: theme.spacing(1.5)}}
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
      <Box
        className={(isMobile ? "" : "left-bar ") + (showFilter ? "show" : "hide")}
        sx={{ml: theme.spacing(1.5), mr: theme.spacing(1.5), mb: theme.spacing(1.5)}}
      >
        <Filters multilist={multiList} />
      </Box>
      <div className="result-container">
        <Box
          className="result-stat-line"
          sx={{ml: theme.spacing(1.5), mr: theme.spacing(1.5)}}
        >
          <ResultStats isLoading={isLoading} totalResult={totalResult} {...props} />
          <Box className="buttons" sx={{ml: "auto"}}>
            <ToggleFilterButton
              showFilter={showFilter}
              onToggleShowFilterButton={() => {
                setShowFilter(!showFilter)
              }}
              {...props}
            />
          </Box>
        </Box>
        <SelectedFilters />
        <SearchResultList
          onChangeLoading={setLoading}
          totalResult={totalResult}
          onChangeTotalResult={setTotalResult}
        />
      </div>
    </Box>
  )
}

export default Search
export {ToggleFilterButton}
