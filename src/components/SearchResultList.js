import React, {useState} from "react"
import {ReactiveList, StateProvider} from "@appbaseio/reactivesearch"
import Grid from "@mui/material/Grid"

import Card from "./Card"
import SearchIndexFrontendConfigContext from "../helpers/SearchIndexFrontendConfigContext"
import PageControl from "./PageControl"
import {useRouter} from "next/router"

/**
 * Result Component
 * creates a Result box UI component that is used to show the result in base of search,
 * configuration fields are set in src/config/prod.json#resultList
 *
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @props Properties from Parent Component
 */
const SearchResultList = (props) => {
  const router = useRouter()
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  //declare varibale to get data from Configuration fle prod.json
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
    <>
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
                    const params = router.query
                    params["size"] = size
                    params[conf.componentId] = "1"
                    router.push({pathname: "/", query: params})
                  }}
                />
              )}
            />
          )
        }}
      >
        {({data, error, loading}) => (
          <Grid container direction="row" alignItems="flex-start">
            {data.map((item) => (
              <Grid key={item._id} item xs={12} sm={6} md={4} lg={3} xl={2}>
                <Card {...item} />
              </Grid>
            ))}
          </Grid>
        )}
      </ReactiveList>
    </>
  )
  function determineInitialPageSize() {
    const sizeParam = router.query["size"] ? router.query["size"] : null
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
