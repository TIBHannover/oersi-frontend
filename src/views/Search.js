import React from "react"
import {useTranslation} from "react-i18next"
import {Helmet} from "react-helmet"
import {Box, useTheme} from "@mui/material"

import {OersiConfigContext} from "../helpers/use-context"
import Filters from "../components/Filters"
import ResultStats from "../components/ResultStats"
import SearchResultList from "../components/SearchResultList"
import SelectedFilters from "../components/SelectedFilters"

const Search = (props) => {
  const theme = useTheme()
  const {isMobile, isFilterViewOpen, onCloseFilterView} = props
  const {t} = useTranslation()
  const oersiConfig = React.useContext(OersiConfigContext)

  return (
    <>
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
        isMobile={isMobile}
        onClose={onCloseFilterView}
        open={isFilterViewOpen}
      />
      <Box
        aria-label="results"
        sx={{ml: theme.spacing(1.5), mr: theme.spacing(1.5)}}
      >
        <ResultStats sx={{marginX: theme.spacing(1.5)}} />
        <SelectedFilters />
        <SearchResultList />
      </Box>
    </>
  )
}

export default Search
