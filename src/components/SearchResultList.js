import React from "react"
import {useHits, useHitsPerPage, usePagination} from "react-instantsearch"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"

import Card from "./Card"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import PageControl from "./PageControl"

const SearchResultList = () => {
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const {items, results} = useHits()
  const pageSize = results?.hitsPerPage
  const paginationApi = usePagination()
  const hitsPerPageApi = useHitsPerPage({
    items: frontendConfig.RESULT_PAGE_SIZE_OPTIONS.map((size) => ({
      label: size,
      value: size,
      default: size === frontendConfig.NR_OF_RESULT_PER_PAGE.toString(),
    })),
  })
  return (
    <>
      <Row xs={1} sm={2} md={3} xl={4} xxl={4} className="g-2">
        {items.map((item) => (
          <Col key={item.objectID}>
            <Card {...item} _id={item.objectID} />
          </Col>
        ))}
      </Row>
      <PageControl
        page={paginationApi.currentRefinement + 1}
        total={paginationApi.nbHits}
        pageSizeOptions={frontendConfig.RESULT_PAGE_SIZE_OPTIONS}
        pageSize={pageSize}
        onChangePage={(page) => {
          paginationApi.refine(page - 1)
          const anchor = document.querySelector("#top-anchor")
          anchor.scrollIntoView({behavior: "smooth", block: "center"})
        }}
        onChangePageSize={(size) => {
          hitsPerPageApi.refine(size)
        }}
      />
    </>
  )
}

SearchResultList.propTypes = {}

export default SearchResultList
