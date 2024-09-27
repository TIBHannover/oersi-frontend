import React from "react"
import {SelectedFilters as ReactiveSearchSelectedFilters} from "@appbaseio/reactivesearch"
import {useTranslation} from "react-i18next"
import Button from "@mui/material/Button"
import CloseIcon from "@mui/icons-material/Close"
import {getDisplayValue} from "../helpers/helpers"
import {Box, useTheme} from "@mui/material"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"

const SelectedFilters = (props) => {
  const theme = useTheme()
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
          theme,
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

export function renderSelectedFilters(data, i18n, theme, fieldsOptions) {
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
          const fieldOption = fieldsOptions?.find((x) => x.dataField === label)
          const isArray = Array.isArray(value)
          const labelTranslationKey =
            label === "search" ? "LABEL.SEARCH" : "data:fieldLabels." + label
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
                {i18n.t(labelTranslationKey)}:{" "}
                {renderValue(fieldOption, value, isArray, i18n)}
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
