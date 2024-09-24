import React from "react"
import Filters from "../components/Filters"
import OersiConfigContext from "../helpers/OersiConfigContext"
import SelectedFilters from "../components/SelectedFilters"
import {Box, useTheme} from "@mui/material"
import ResultStats from "../components/ResultStats"
import SearchResultList from "../components/SearchResultList"
import {useTranslation} from "next-i18next"

const Search = (props) => {
  const theme = useTheme()
  const {t} = useTranslation()
  const oersiConfig = React.useContext(OersiConfigContext)
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

  return (
    <>
      {/* TODO */}
      {/*<Head>*/}
      {/*  {defaultSearchJsonLd != null && (*/}
      {/*    <script type="application/ld+json">{defaultSearchJsonLd}</script>*/}
      {/*  )}*/}
      {/*</Head>*/}
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
