import {useTranslation} from "react-i18next"
import React from "react"
import {StateProvider} from "@appbaseio/reactivesearch"
import Spinner from "react-bootstrap/Spinner"

const ResultStats = (props) => {
  const {t} = useTranslation()
  return (
    <StateProvider
      componentIds="results"
      includeKeys={["hits", "isLoading"]}
      strict={false}
      render={({searchState}) => (
        <div aria-label="total-result" className={props.textClasses || "h6"}>
          {searchState.results?.isLoading ? (
            <Spinner aria-label="loading-spinner" animation="border" size="sm" />
          ) : (
            t("RESULT_LIST.SHOW_RESULT_STATS", {
              total: searchState.results?.hits?.total,
            })
          )}{" "}
        </div>
      )}
    />
  )
}
export default ResultStats
