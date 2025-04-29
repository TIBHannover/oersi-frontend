import React, {useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import {Helmet} from "react-helmet"
import {useLocation} from "react-router"

import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import Filters from "../components/Filters"
import ResultStats from "../components/ResultStats"
import SearchResultList from "../components/SearchResultList"
import SelectedFilters from "../components/SelectedFilters"

const Search = (props) => {
  const {t} = useTranslation()
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const location = useLocation()
  const isSearchView = location.pathname === frontendConfig.routes.SEARCH
  const [searchJsonLd, setSearchJsonLd] = useState(null)
  const defaultSearchJsonLd = JSON.stringify(
    {
      "@context": "https://schema.org/",
      "@type": "WebSite",
      name: t("META.TITLE"),
      description: t("META.DESCRIPTION"),
      url: frontendConfig.PUBLIC_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: frontendConfig.PUBLIC_URL + "/?search=%22{search_term_string}%22",
        "query-input": "name=search_term_string",
      },
    },
    null,
    2
  )

  useEffect(() => {
    if (isSearchView) {
      setSearchJsonLd(defaultSearchJsonLd)
    } else {
      setSearchJsonLd(null)
    }
  }, [isSearchView, defaultSearchJsonLd])

  return (
    <>
      <Helmet>
        {searchJsonLd != null && (
          <script type="application/ld+json">{searchJsonLd}</script>
        )}
      </Helmet>
      <Row className="g-0">
        <Col
          className={
            "filter-sidebar z-1 p-0 bg-body" +
            (frontendConfig.isFilterViewOpen ? "" : " closed")
          }
          xs={12}
          md={3}
          xxl={2}
        >
          <Filters />
        </Col>
        <Col aria-label="results" className="m-3">
          <ResultStats textClasses="h6 mx-2" />
          <SelectedFilters />
          <SearchResultList />
        </Col>
      </Row>
    </>
  )
}

export default Search
