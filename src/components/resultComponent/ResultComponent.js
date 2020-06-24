import React, {useState} from "react"
import config from "react-global-configuration"
import {ReactiveList} from "@appbaseio/reactivesearch"
import "./ResultComponent.css"
import Card from "./card/Card"
import {withTranslation} from "react-i18next"

/**
 * Result Component
 * creates a Result box UI component that is used to show the result in base of search,
 * configuration fields are set in src/config/prod.json#resultList
 *
 * @author Edmond Kacaj <edmondikacaj@gmail.com>
 * @props Properties from Parent Component
 */
const ResultComponent = (props) => {
  //declare varibale to get data from Configuration fle prod.json
  const [conf] = useState(config.get("resultList"))
  return (
    <>
      <div className="result-list col-md-12">
        <ReactiveList
          componentId={conf.component}
          dataField={conf.dataFiled}
          stream={conf.stream}
          pagination={conf.pagination}
          paginationAt={conf.paginationAt}
          pages={conf.pagesShow}
          sortBy={conf.sortBy}
          size={conf.sizeShow}
          loader={conf.loader}
          showEndPage={conf.showEndPage}
          URLParams={conf.URLParams}
          showResultStats={conf.showResultStats}
          renderItem={(data) => <Card key={Math.random()} {...data} />}
          renderError
          // renderError={() => this.props.onHandleError(true)}
          react={{
            and: conf.and,
          }}
          noResults="No results were found..."
          sortOptions={conf.sortByDynamic}
          renderResultStats={function (stats) {
            return (
              <div className="render-result">
                <span>
                  {props
                    .t("RESILT_LIST.SHOW_RESULT_STATS")
                    .replace("_result_", stats.numberOfResults)
                    .replace("_ms_", stats.time)}
                </span>
              </div>
            )
          }}
        />
      </div>
    </>
  )
}

ResultComponent.propTypes = {}

export default withTranslation()(ResultComponent)
