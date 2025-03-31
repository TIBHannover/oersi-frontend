import React from "react"
import {SelectedFilters as ReactiveSearchSelectedFilters} from "@appbaseio/reactivesearch"
import {useTranslation} from "react-i18next"
import Button from "react-bootstrap/Button"
import Stack from "react-bootstrap/Stack"
import {getDisplayValue} from "../helpers/helpers"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import {CloseIcon} from "./CustomIcons"

const SelectedFilters = (props) => {
  const {t, i18n} = useTranslation(["translation", "labelledConcept", "data"])
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  return (
    <ReactiveSearchSelectedFilters
      showClearAll={true}
      clearAllLabel={t("FILTER.CLEAR_ALL")}
      render={(data) =>
        renderSelectedFilters(
          data,
          i18n,
          frontendConfig.isDarkMode,
          frontendConfig.fieldConfiguration?.options
        )
      }
    />
  )
}

function renderValue(fieldOption, value, isArray, i18n) {
  if (isArray && value.length) {
    const arrayToRender = value.map((item) =>
      renderValue(fieldOption, item, Array.isArray(item), i18n)
    )
    return arrayToRender.join(", ")
  }
  return getDisplayValue(value, fieldOption, i18n)
}

export function renderSelectedFilters(data, i18n, isDarkMode, fieldsOptions) {
  const selectedValues = data.selectedValues
  const appliedFilters = Object.keys(data.selectedValues)
  const buttonVariant = isDarkMode ? "secondary" : "light"
  let hasValues = false
  return (
    <Stack direction="horizontal" gap={2} className="selectedFilters my-2">
      {appliedFilters
        .filter(
          (id) => data.components.includes(id) && selectedValues[id].showFilter
        )
        .map((component) => {
          const {label, value} = selectedValues[component]
          const fieldOption = fieldsOptions?.find((x) => x.dataField === label)
          const isArray = Array.isArray(value)
          const labelTranslationKey =
            label === "search" ? "LABEL.SEARCH" : "data:fieldLabels." + label
          if (label && ((isArray && value.length) || (!isArray && value))) {
            hasValues = true
            return (
              <Button
                variant={buttonVariant}
                key={component}
                onClick={() => data.setValue(component, null)}
              >
                {i18n.t(labelTranslationKey)}:{" "}
                {renderValue(fieldOption, value, isArray, i18n)}
                <CloseIcon className="ms-2" />
              </Button>
            )
          }
          return null
        })}
      {hasValues ? (
        <Button variant={buttonVariant} onClick={data.clearValues}>
          {data.clearAllLabel}
        </Button>
      ) : null}
    </Stack>
  )
}

export default SelectedFilters
