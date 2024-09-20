import {SingleDataList} from "@appbaseio/reactivesearch"
import React, {useState} from "react"
import {Box, Chip, FormControlLabel, Switch, useTheme} from "@mui/material"
import {useTranslation} from "react-i18next"
import {useLocation} from "react-router-dom"
import {getDisplayValue, getParams} from "../helpers/helpers"
import {OersiConfigContext} from "../helpers/use-context"

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
  const location = useLocation()
  const locationParam = getParams(location, props.componentId)
  const theme = useTheme()
  const {i18n} = useTranslation(["translation", "labelledConcept", "data"])
  const oersiConfig = React.useContext(OersiConfigContext)
  const {dataField, switchableFieldValue, defaultChecked} = props
  const labelKey = props.labelKey ? props.labelKey : dataField
  const fieldOption = oersiConfig.fieldConfiguration?.options?.find(
    (x) => x.dataField === dataField
  )
  const [isChecked, setIsChecked] = useState(
    (locationParam != null && locationParam === '"' + switchableFieldValue + '"') ||
      defaultChecked
  )
  const toggleValue = () => {
    setIsChecked(!isChecked)
  }
  return (
    <Box sx={{margin: theme.spacing(2)}}>
      <SingleDataList
        {...props}
        filterLabel={labelKey}
        data={[{label: switchableFieldValue, value: switchableFieldValue}]}
        showSearch={false}
        showRadio={false}
        showCount={true}
        URLParams={true}
        value={isChecked ? switchableFieldValue : ""}
        onChange={(e) => {
          setIsChecked(e === switchableFieldValue)
        }}
      >
        {({data, value}) => {
          const item = data.find((e) => e.label === switchableFieldValue)
          return (
            <LabelledSwitch
              checked={value === switchableFieldValue}
              labelText={getDisplayValue(switchableFieldValue, fieldOption, i18n)}
              onChangeValue={toggleValue}
              recordCount={item.count}
            />
          )
        }}
      </SingleDataList>
    </Box>
  )
}

export default SwitchFilter
