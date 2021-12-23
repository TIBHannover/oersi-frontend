import React from "react"
import {SelectedFilters as ReactiveSearchSelectedFilters} from "@appbaseio/reactivesearch"
import {useTranslation} from "react-i18next"
import Button from "@material-ui/core/Button"
import CloseIcon from "@material-ui/icons/Close"
import {getLabelForStandardComponent} from "../helpers/helpers"

const SelectedFilters = (props) => {
  const {t} = useTranslation(["translation", "lrt", "subject"])
  return (
    <ReactiveSearchSelectedFilters
      showClearAll={true}
      clearAllLabel={t("FILTER.CLEAR_ALL")}
      render={(data) => renderSelectedFilters(data, t)}
    />
  )
}

function renderValue(component, value, isArray, t) {
  if (isArray && value.length) {
    const arrayToRender = value.map((item) =>
      renderValue(component, item, Array.isArray(item), t)
    )
    return arrayToRender.join(", ")
  }
  return getLabelForStandardComponent(value, component, t)
}

export function renderSelectedFilters(data, t) {
  const selectedValues = data.selectedValues
  const appliedFilters = Object.keys(data.selectedValues)
  let hasValues = false
  return (
    <div className="selectedFilters ml-3 mr-3">
      {appliedFilters
        .filter(
          (id) => data.components.includes(id) && selectedValues[id].showFilter
        )
        .map((component) => {
          const {label, value} = selectedValues[component]
          const isArray = Array.isArray(value)
          if (label && ((isArray && value.length) || (!isArray && value))) {
            hasValues = true
            return (
              <Button
                variant="contained"
                disableElevation
                className="m-1"
                key={component}
                onClick={() => data.setValue(component, null)}
                endIcon={<CloseIcon />}
              >
                {t("LABEL." + selectedValues[component].label.toUpperCase())}:{" "}
                {renderValue(component, value, isArray, t)}
              </Button>
            )
          }
          return null
        })}
      {hasValues ? (
        <Button
          variant="contained"
          disableElevation
          className="m-1"
          onClick={data.clearValues}
        >
          {data.clearAllLabel}
        </Button>
      ) : null}
    </div>
  )
}

export default SelectedFilters
