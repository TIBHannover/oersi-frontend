import {useToggleRefinement} from "react-instantsearch"
import React, {useEffect, useState} from "react"
import {Box, Chip, FormControlLabel, Switch, useTheme} from "@mui/material"
import {useTranslation} from "next-i18next"
import {getDisplayValue, getParams} from "../helpers/helpers"
import {useRouter} from "next/router"
import SearchIndexFrontendConfigContext from "../helpers/SearchIndexFrontendConfigContext"

const LabelledSwitch = (props) => {
  return (
    <FormControlLabel
      control={<Switch checked={props.checked} onChange={props.onChangeValue} />}
      label={
        <>
          <Box
            className="filter-item-label-text"
            title={props.labelText}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {props.labelText}
          </Box>
          <Chip
            className="filter-item-counter-badge"
            label={props.recordCount}
            color="primary"
            size="small"
            sx={{ml: "auto", height: "unset"}}
          />
        </>
      }
      className={"full-width"}
      sx={{mr: 0, mb: 0, overflow: "hidden"}}
      componentsProps={{
        typography: {
          sx: {display: "flex", alignItems: "center", overflow: "hidden"},
        },
      }}
      classes={{label: "filter-item-label full-width"}}
    />
  )
}
const SwitchFilter = (props) => {
  const router = useRouter()
  const locationParam = getParams(router, props.componentId)
  const theme = useTheme()
  const {i18n} = useTranslation(["translation", "labelledConcept", "data"], {
    bindI18n: "languageChanged loaded",
  })
  const frontendConfig = React.useContext(SearchIndexFrontendConfigContext)
  const {dataField, switchableFieldValue, defaultChecked} = props
  const {value, refine} = useToggleRefinement({
    attribute: props.componentId,
    on: switchableFieldValue, // does not work for colons in the value (value cut off after colon)
  })
  const labelKey = props.labelKey ? props.labelKey : dataField
  const fieldOption = frontendConfig.fieldConfiguration?.options?.find(
    (x) => x.dataField === dataField
  )
  const [isChecked, setIsChecked] = useState(
    (locationParam != null && locationParam === '"' + switchableFieldValue + '"') ||
      defaultChecked
  )
  const toggleValue = () => {
    refine({isRefined: !isChecked})
    setIsChecked(!isChecked)
  }
  useEffect(() => {
    i18n.reloadResources(i18n.resolvedLanguage, ["labelledConcept"])
  }, [i18n.resolvedLanguage])

  return (
    <Box sx={{margin: theme.spacing(2)}}>
      <LabelledSwitch
        checked={value.isRefined}
        labelText={getDisplayValue(switchableFieldValue, fieldOption, i18n)}
        onChangeValue={toggleValue}
        recordCount={value.count}
      />
    </Box>
  )
}

export default SwitchFilter
