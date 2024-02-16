import React, {useEffect, useState} from "react"
import Head from "next/head"
import Filters from "../components/Filters"
import OersiConfigContext from "../helpers/OersiConfigContext"
import SelectedFilters from "../components/SelectedFilters"
import {Box, useTheme} from "@mui/material"
import ResultStats from "../components/ResultStats"
import SearchResultList from "../components/SearchResultList"
import {useTranslation} from "next-i18next"
import {useRouter} from "next/router"

const Search = (props) => {
  const theme = useTheme()
  const {t} = useTranslation()
  const oersiConfig = React.useContext(OersiConfigContext)
  const router = useRouter()
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
    if (router.pathname === "/") {
      setSearchJsonLd(defaultSearchJsonLd)
    } else {
      setSearchJsonLd(null)
    }
  }, [router, defaultSearchJsonLd])

  return (
    <>
      {router.pathname === "/" && (
        <Head>
          {searchJsonLd != null && (
            <script type="application/ld+json">{searchJsonLd}</script>
          )}
        </Head>
      )}
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
