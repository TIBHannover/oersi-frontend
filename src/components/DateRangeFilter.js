import React from "react"
import {RangeInput} from "react-instantsearch"
import Accordion from "react-bootstrap/Accordion"
import {useTranslation} from "react-i18next"

// NOTE: under development, first draft/impression
// => not ready yet
const DateRangeFilter = (props) => {
  const {t} = useTranslation(["translation", "language", "labelledConcept", "data"])
  const {dataField} = props
  const labelKey = props.labelKey ? props.labelKey : dataField

  return (
    <Accordion.Item eventKey={props.componentId}>
      <Accordion.Header>
        <div className="filter-heading fw-bold">
          {t("data:fieldLabels." + labelKey)}
        </div>
      </Accordion.Header>
      <Accordion.Body className="multilist px-3">
        <RangeInput attribute={props.componentId} />
      </Accordion.Body>
    </Accordion.Item>
  )
}

export default DateRangeFilter
