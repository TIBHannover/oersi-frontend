import React, {useState} from "react"
import {useTranslation} from "react-i18next"

import MultiSelectionFilter from "./MultiSelectionFilter"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import ResultStats from "./ResultStats"
import SwitchFilter from "./SwitchFilter"
import DateRangeFilter from "./DateRangeFilter"
import Accordion from "react-bootstrap/Accordion"
import Button from "react-bootstrap/Button"
import Stack from "react-bootstrap/Stack"

const Filters = (props) => {
  const {t} = useTranslation()
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const [filtersConfig] = useState(frontendConfig.searchConfiguration.filters)
  const {onCloseFilterView} = frontendConfig

  return (
    <div>
      <Stack
        className="p-3 d-flex d-md-none justify-content-end"
        gap={3}
        direction="horizontal"
      >
        <ResultStats textClasses="fs-6" />
        <Button onClick={onCloseFilterView}>{t("FILTER.SHOW_RESULTS")}</Button>
      </Stack>
      <Accordion flush alwaysOpen>
        {filtersConfig.map((item) => {
          if (item.type === "switch") {
            return <SwitchFilter key={item.componentId} {...item} />
          } else if (item.type === "daterange") {
            return <DateRangeFilter key={item.componentId} {...item} />
          }
          return <MultiSelectionFilter key={item.componentId} {...item} />
        })}
      </Accordion>
    </div>
  )
}

export default Filters
