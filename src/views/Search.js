import React, {useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
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
      {/*<Container> className="d-flex flex-nowrap"*/}
      <Container fluid={true} className="px-0">
        <Row className="g-0">
          <Col
            className={
              "filter-sidebar p-0" +
              (frontendConfig.isDesktopFilterViewOpen ? "" : " closed")
            }
            // style={{width: frontendConfig.isDesktopFilterViewOpen ? "100%" : "0"}}
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
      </Container>
    </>
  )
}

export default Search
