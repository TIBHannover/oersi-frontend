import React, {useState} from "react"
import config from "react-global-configuration"
import {ReactiveList} from "@appbaseio/reactivesearch"
import Grid from "@mui/material/Grid"

import Card from "./Card"
import {OersiConfigContext} from "../helpers/use-context"
import getParams, {setParams} from "../helpers/helpers"
import PageControl from "./PageControl"

/**
 * Result Component
 * creates a Result box UI component that is used to show the result in base of search,
 * configuration fields are set in src/config/prod.json#resultList
 *
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @props Properties from Parent Component
 */
const SearchResultList = (props) => {
  const [totalResult, setTotalResult] = useState(0)
  const oersiConfig = React.useContext(OersiConfigContext)
  //declare varibale to get data from Configuration fle prod.json
  const [conf] = useState(config.get("resultList"))
  const [pageSize, setPageSize] = useState(determineInitialPageSize())
  const defaultQuery = function () {
    return {
      track_total_hits: oersiConfig.TRACK_TOTAL_HITS
        ? oersiConfig.TRACK_TOTAL_HITS
        : true,
    }
  }
  return (
    <>
      <ReactiveList
        componentId={conf.component}
        dataField={conf.dataField}
        stream={false}
        pagination={conf.pagination}
        paginationAt={conf.paginationAt}
        pages={conf.pagesShow}
        sortBy={conf.sortBy}
        size={pageSize}
        showLoader={false}
        showEndPage={conf.showEndPage}
        URLParams={conf.URLParams}
        showResultStats={conf.showResultStats}
        renderError
        react={{and: conf.and}}
        defaultQuery={defaultQuery}
        sortOptions={conf.sortByDynamic}
        renderNoResults={() => setTotalResult(0)}
        renderResultStats={(stats) => renderStatistics(stats)}
        renderPagination={({
          pages,
          totalPages,
          currentPage,
          setPage,
          fragmentName,
        }) => {
          return (
            <PageControl
              page={currentPage + 1}
              total={totalResult}
              pageSizeOptions={oersiConfig.RESULT_PAGE_SIZE_OPTIONS}
              pageSize={pageSize}
              onChangePage={(page) => {
                setPage(page - 1)
              }}
              onChangePageSize={(size) => {
                setPageSize(size)
                window.location.search = setParams(window.location, {
                  name: "size",
                  value: size,
                })
              }}
            />
          )
        }}
      >
        {({data, error, loading}) => (
          <Grid container direction="row" alignItems="flex-start">
            {data.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <Card key={item._id} {...item} />
              </Grid>
            ))}
          </Grid>
        )}
      </ReactiveList>
    </>
  )
  function renderStatistics(stats) {
    setTotalResult(stats.numberOfResults)
  }
  function determineInitialPageSize() {
    const sizeParam = getParams(window.location, "size")
    if (
      sizeParam != null &&
      oersiConfig.RESULT_PAGE_SIZE_OPTIONS.indexOf(sizeParam) !== -1
    ) {
      return parseInt(sizeParam)
    } else {
      return oersiConfig.NR_OF_RESULT_PER_PAGE
    }
  }
}

SearchResultList.propTypes = {}

export default SearchResultList
