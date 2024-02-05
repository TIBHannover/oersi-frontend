import React, {useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import {Helmet} from "react-helmet"
import {Box, useTheme} from "@mui/material"
import {useLocation} from "react-router-dom"

import {OersiConfigContext} from "../helpers/use-context"
import Filters from "../components/Filters"
import ResultStats from "../components/ResultStats"
import SearchResultList from "../components/SearchResultList"
import SelectedFilters from "../components/SelectedFilters"

const Search = (props) => {
  const theme = useTheme()
  const {t} = useTranslation()
  const oersiConfig = React.useContext(OersiConfigContext)
  const location = useLocation()
  const [searchJsonLd, setSearchJsonLd] = useState(null)
  const defaultSearchJsonLd = JSON.stringify(
    {
      "@context": "https://schema.org/",
      "@type": "WebSite",
      name: t("META.TITLE"),
      description: t("META.DESCRIPTION"),
      url: oersiConfig.PUBLIC_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: oersiConfig.PUBLIC_URL + "/?search=%22{search_term_string}%22",
        "query-input": "name=search_term_string",
      },
    },
    null,
    2
  )

  useEffect(() => {
    if (location.pathname === "/") {
      setSearchJsonLd(defaultSearchJsonLd)
    } else {
      setSearchJsonLd(null)
    }
  }, [location, defaultSearchJsonLd])

  return (
    <>
      <Helmet>
        {searchJsonLd != null && (
          <script type="application/ld+json">{searchJsonLd}</script>
        )}
      </Helmet>
      <Filters />
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
