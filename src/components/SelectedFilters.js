import React from "react"
import {
  useClearRefinements,
  useCurrentRefinements,
  useSearchBox,
} from "react-instantsearch"
import {useTranslation} from "react-i18next"
import Button from "react-bootstrap/Button"
import Stack from "react-bootstrap/Stack"
import {getDisplayValue} from "../helpers/helpers"
import {SearchIndexFrontendConfigContext} from "../helpers/use-context"
import CloseIcon from "./icons/CloseIcon"

const SelectedSearchFilter = (props) => {
  const {t} = useTranslation(["translation"])
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const {clear, query} = useSearchBox(props)
  const buttonVariant = frontendConfig.isDarkMode ? "secondary" : "light"

  return (
    query && (
      <Button variant={buttonVariant} onClick={() => clear()}>
        {t("LABEL.SEARCH")}: {query}
        <CloseIcon className="ms-2" />
      </Button>
    )
  )
}

const SelectedFilters = (props) => {
  const {t, i18n} = useTranslation(["translation", "labelledConcept", "data"])
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const clearRefinements = useClearRefinements()
  const {items, refine} = useCurrentRefinements()
  const searchBoxApi = useSearchBox(props)
  const buttonVariant = frontendConfig.isDarkMode ? "secondary" : "light"

  return (
    <Stack direction="horizontal" gap={2} className="selectedFilters my-2">
      <SelectedSearchFilter />
      {items.map((component) => {
        const componentId = component.label
        const filter = frontendConfig.searchConfiguration.filters.find(
          (x) => x.componentId === componentId
        )
        const dataField = filter?.dataField || componentId
        const labelKey = filter?.labelKey || dataField
        const value = component.refinements.map((x) => x.value)
        const fieldOption = frontendConfig.fieldConfiguration?.options?.find(
          (x) => x.dataField === dataField
        )
        const labelTranslationKey = "data:fieldLabels." + labelKey
        return (
          <Button
            variant={buttonVariant}
            key={componentId}
            onClick={() => {
              for (const refinement of component.refinements) {
                refine(refinement)
              }
            }}
          >
            {i18n.t(labelTranslationKey)}:{" "}
            {renderValue(fieldOption, value, true, i18n)}
            <CloseIcon className="ms-2" />
          </Button>
        )
      })}
      {clearRefinements.canRefine || searchBoxApi.query ? (
        <Button
          variant={buttonVariant}
          onClick={() => {
            if (clearRefinements.canRefine) {
              clearRefinements.refine()
            }
            if (searchBoxApi.query) {
              searchBoxApi.clear()
            }
          }}
        >
          {t("FILTER.CLEAR_ALL")}
        </Button>
      ) : null}
    </Stack>
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

export default SelectedFilters
