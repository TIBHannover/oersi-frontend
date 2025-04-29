import React, {useState} from "react"
import {ReactiveList, StateProvider} from "@appbaseio/reactivesearch"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"

import Card from "./Card"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import {getParams} from "../helpers/helpers"
import PageControl from "./PageControl"
import {useNavigate, useLocation} from "react-router"

/**
 * Result Component
 * creates a Result box UI component that is used to show the result in base of search,
 * configuration fields are set in src/config/prod.json#resultList
 *
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @props Properties from Parent Component
 */
const SearchResultList = (props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const [conf] = useState(frontendConfig.searchConfiguration.resultList)
  const [pageSize, setPageSize] = useState(determineInitialPageSize())
  const defaultQuery = function () {
    return {
      track_total_hits: frontendConfig.TRACK_TOTAL_HITS
        ? frontendConfig.TRACK_TOTAL_HITS
        : true,
    }
  }
  return (
    <ReactiveList
      componentId={conf.componentId}
      dataField={
        conf.dataField
          ? conf.dataField
          : frontendConfig.fieldConfiguration?.baseFields?.title
      }
      stream={false}
      pagination={conf.pagination}
      paginationAt={conf.paginationAt}
      pages={conf.pagesShow}
      sortBy={conf.sortBy}
      size={pageSize}
      showLoader={false}
      showEndPage={conf.showEndPage}
      URLParams={true}
      showResultStats={false}
      renderError
      react={conf.react}
      defaultQuery={defaultQuery}
      sortOptions={conf.sortOptions}
      renderNoResults={() => ""}
      renderPagination={({
        pages,
        totalPages,
        currentPage,
        setPage,
        fragmentName,
      }) => {
        return (
          <StateProvider
            componentIds={conf.componentId}
            includeKeys={["hits"]}
            strict={false}
            render={({searchState}) => (
              <PageControl
                page={currentPage + 1}
                total={
                  searchState.results?.hits?.total
                    ? searchState.results?.hits?.total
                    : 0
                }
                pageSizeOptions={frontendConfig.RESULT_PAGE_SIZE_OPTIONS}
                pageSize={pageSize}
                onChangePage={(page) => {
                  setPage(page - 1)
                }}
                onChangePageSize={(size) => {
                  setPageSize(parseInt(size))
                  const params = new URLSearchParams(location.search)
                  params.set("size", size)
                  params.set(conf.componentId, "1")
                  navigate({
                    pathname: frontendConfig.routes.SEARCH,
                    search: "?" + params.toString(),
                  })
                }}
              />
            )}
          />
        )
      }}
    >
      {({data, error, loading}) => (
        <Row xs={1} sm={2} md={3} xl={4} xxl={4} className="g-2">
          {data.map((item) => (
            <Col key={item._id}>
              <Card {...item} />
            </Col>
          ))}
        </Row>
      )}
    </ReactiveList>
  )
  function determineInitialPageSize() {
    const sizeParam = getParams(location, "size")
    if (
      sizeParam != null &&
      frontendConfig.RESULT_PAGE_SIZE_OPTIONS.indexOf(sizeParam) !== -1
    ) {
      return parseInt(sizeParam)
    } else {
      return frontendConfig.NR_OF_RESULT_PER_PAGE
    }
  }
}

SearchResultList.propTypes = {}

export default SearchResultList
