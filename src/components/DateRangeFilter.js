import React from "react"
import {RangeInput} from "react-instantsearch"
import Accordion from "react-bootstrap/Accordion"
import {useTranslation} from "react-i18next"

function toDateString(value, language) {
  let date = new Date(value)
  return new Intl.DateTimeFormat(language, {dateStyle: "short"}).format(date)
}

// NOTE: under development, first draft/impression
// => reactivesearch component seems to have bugs (cannot select first value) and is hard to customize
const DateRangeFilter = (props) => {
  const {t, i18n} = useTranslation([
    "translation",
    "language",
    "labelledConcept",
    "data",
  ])
  const {dataField} = props
  const labelKey = props.labelKey ? props.labelKey : dataField
  // TODO implmement this component

  return (
    <Accordion.Item eventKey={props.componentId}>
      <Accordion.Header>
        <div className="filter-heading fw-bold">
          {t("data:fieldLabels." + labelKey)}
        </div>
      </Accordion.Header>
      <Accordion.Body className="multilist px-3">
        {/*<DynamicRangeSlider*/}
        {/*  dataField={dataField}*/}
        {/*  componentId={props.componentId}*/}
        {/*  filterLabel={labelKey}*/}
        {/*  calendarInterval={"month"}*/}
        {/*  tooltipTrigger={"hover"}*/}
        {/*  // stepValue={1000 * 60 * 60 * 24}*/}
        {/*  queryFormat={"epoch_millis"}*/}
        {/*  showHistogram={true}*/}
        {/*  URLParams={true}*/}
        {/*  rangeLabels={(min, max) => {*/}
        {/*    return {*/}
        {/*      start: toDateString(min, i18n.resolvedLanguage),*/}
        {/*      end: toDateString(max, i18n.resolvedLanguage),*/}
        {/*    }*/}
        {/*  }}*/}
        {/*  renderTooltipData={(data) => (*/}
        {/*    <div className="h6">{toDateString(data, i18n.resolvedLanguage)}</div>*/}
        {/*  )}*/}
        {/*></DynamicRangeSlider>*/}
        <RangeInput attribute={props.componentId} />
      </Accordion.Body>
    </Accordion.Item>
  )
}

export default DateRangeFilter
