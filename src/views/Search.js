import React, {useState} from "react"
import {useTranslation} from "react-i18next"
import {Helmet} from "react-helmet"
import {Box, Divider, useTheme} from "@mui/material"
import {useLocation} from "react-router-dom"

import {OersiConfigContext} from "../helpers/use-context"
import Filters from "../components/Filters"
import ResultStats from "../components/ResultStats"
import SearchResultList from "../components/SearchResultList"
import SelectedFilters from "../components/SelectedFilters"
import config from "react-global-configuration"
import SwitchFilter from "../components/SwitchFilter"

const Search = (props) => {
  const [switchList] = useState(config.get("switchList"))
  const theme = useTheme()
  const {isMobile, isFilterViewOpen, onCloseFilterView} = props
  const {t} = useTranslation()
  const oersiConfig = React.useContext(OersiConfigContext)
  const location = useLocation()
  const enabledFilters = oersiConfig.ENABLED_FILTERS
    ? oersiConfig.ENABLED_FILTERS
    : []

  return (
    <>
      {location.pathname === "/" && (
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
      )}
      <Filters
        isMobile={isMobile}
        onClose={onCloseFilterView}
        open={isFilterViewOpen}
      />
      <Box
        aria-label="results"
        sx={{ml: theme.spacing(1.5), mr: theme.spacing(1.5)}}
      >
        <Box sx={{display: "flex", alignItems: "center"}}>
          <ResultStats sx={{marginX: theme.spacing(1.5)}} />
          {switchList
            .filter((item) => enabledFilters.includes(item.componentId))
            .map((item, index) => (
              <>
                <Divider flexItem={true} orientation="vertical" variant="middle" />
                <SwitchFilter key={item.componentId} {...item} />
              </>
            ))}
        </Box>
        <SelectedFilters />
        <SearchResultList />
      </Box>
    </>
  )
}

export default Search
