import React, {useState} from "react"
import config from "react-global-configuration"
import {ReactiveList} from "@appbaseio/reactivesearch"
import "./ResultComponent.css"
import TileCard from "./card/Card"
import {withTranslation} from "react-i18next"
import "antd/dist/antd.css"
import {Pagination} from "antd"
import {ConfigurationRunTime} from "../../helpers/use-context"
import getParams, {setParams} from "../../helpers/helpers"
import Grid from "@material-ui/core/Grid"

/**
 * Result Component
 * creates a Result box UI component that is used to show the result in base of search,
 * configuration fields are set in src/config/prod.json#resultList
 *
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @props Properties from Parent Component
 */
const ResultComponent = (props) => {
  const context = React.useContext(ConfigurationRunTime)
  //declare varibale to get data from Configuration fle prod.json
  const [conf] = useState(config.get("resultList"))
  const [pageSize, setPageSize] = useState(getPageSize())
  const [totalResult, setTotalResult] = useState(0)
  const defaultQuery = function () {
    return {
      track_total_hits: context.TRACK_TOTAL_HITS ? context.TRACK_TOTAL_HITS : true,
    }
  }
  return (
    <>
      <div className="result-list col-md-12">
        <ReactiveList
          componentId={conf.component}
          dataField={conf.dataField}
          stream={conf.stream}
          pagination={conf.pagination}
          paginationAt={conf.paginationAt}
          pages={conf.pagesShow}
          sortBy={conf.sortBy}
          size={pageSize}
          loader={conf.loader}
          showEndPage={conf.showEndPage}
          URLParams={conf.URLParams}
          showResultStats={conf.showResultStats}
          renderError
          react={{and: conf.and}}
          noResults="No results were found..."
          defaultQuery={defaultQuery}
          sortOptions={conf.sortByDynamic}
          renderResultStats={(stats) => renderStatistics(stats)}
          renderPagination={({
            pages,
            totalPages,
            currentPage,
            setPage,
            fragmentName,
          }) => {
            return (
              <Pagination
                showQuickJumper
                current={currentPage + 1}
                defaultCurrent={currentPage + 1}
                total={totalResult}
                pageSizeOptions={context.RESULT_PAGE_SIZE_OPTIONS}
                showTotal={(total, range) =>
                  props
                    .t("RESULT_LIST.SHOW_TOTAL")
                    .replace("_range-start_", range[0])
                    .replace("_range-end_", range[1])
                    .replace("_total_", total)
                }
                defaultPageSize={pageSize}
                onChange={(page, pageSiz) => {
                  setPage(page - 1)
                }}
                onShowSizeChange={(current, size) => {
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
                <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                  <TileCard key={item._id} {...item} />
                </Grid>
              ))}
            </Grid>
          )}
        </ReactiveList>
      </div>
    </>
  )
  function renderStatistics(stats) {
    setTotalResult(stats.numberOfResults)
    return (
      <div className="render-result">
        <span>
          {props
            .t("RESULT_LIST.SHOW_RESULT_STATS")
            .replace("_result_", stats.numberOfResults)}
        </span>
      </div>
    )
  }
  function getPageSize() {
    const sizeParam = getParams(window.location, "size")
    if (
      sizeParam != null &&
      context.RESULT_PAGE_SIZE_OPTIONS.indexOf(sizeParam) !== -1
    ) {
      return parseInt(sizeParam)
    } else {
      return context.NR_OF_RESULT_PER_PAGE
    }
  }
}

ResultComponent.propTypes = {}

export default withTranslation()(ResultComponent)
