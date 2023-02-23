import React from "react"
import {SelectedFilters as ReactiveSearchSelectedFilters} from "@appbaseio/reactivesearch"
import {useTranslation} from "react-i18next"
import Button from "@mui/material/Button"
import CloseIcon from "@mui/icons-material/Close"
import {getLabelForStandardComponent} from "../helpers/helpers"
import {Box, useTheme} from "@mui/material"

const SelectedFilters = (props) => {
  const theme = useTheme()
  const {t} = useTranslation(["translation", "labelledConcept"])
  return (
    <ReactiveSearchSelectedFilters
      showClearAll={true}
      clearAllLabel={t("FILTER.CLEAR_ALL")}
      render={(data) => renderSelectedFilters(data, t, theme)}
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

export function renderSelectedFilters(data, t, theme) {
  const selectedValues = data.selectedValues
  const appliedFilters = Object.keys(data.selectedValues)
  let hasValues = false
  return (
    <Box
      className="selectedFilters"
      sx={{ml: theme.spacing(1.5), mr: theme.spacing(1.5)}}
    >
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
                color="grey"
                disableElevation
                sx={{margin: theme.spacing(0.5)}}
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
          color="grey"
          disableElevation
          sx={{margin: theme.spacing(0.5)}}
          onClick={data.clearValues}
        >
          {data.clearAllLabel}
        </Button>
      ) : null}
    </Box>
  )
}

export default SelectedFilters
