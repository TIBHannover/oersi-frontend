import {useTranslation} from "react-i18next"
import React from "react"
import {useInstantSearch, useStats} from "react-instantsearch"
import Spinner from "react-bootstrap/Spinner"

const ResultStats = (props) => {
  const {t} = useTranslation()
  const {status} = useInstantSearch()
  const {nbHits} = useStats()
  const isLoading = status === "loading" || status === "stalled"

  return (
    <div aria-label="total-result" className={props.textClasses || "h6"}>
      {isLoading ? (
        <Spinner aria-label="loading-spinner" animation="border" size="sm" />
      ) : (
        t("RESULT_LIST.SHOW_RESULT_STATS", {
          total: nbHits,
        })
      )}{" "}
    </div>
  )
}
export default ResultStats
