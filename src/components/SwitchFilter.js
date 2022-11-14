import {SingleDataList} from "@appbaseio/reactivesearch"
import React, {useState} from "react"
import {Box, FormControlLabel, Switch, useTheme} from "@mui/material"
import {useTranslation} from "react-i18next"
import {useLocation} from "react-router-dom"
import {getLabelForStandardComponent, getParams} from "../helpers/helpers"

const LabelledSwitch = (props) => {
  return (
    <FormControlLabel
      control={<Switch checked={props.checked} onChange={props.onChangeValue} />}
      label={<Box title={props.labelText}>{props.labelText}</Box>}
      sx={{mr: 0, mb: 0}}
      componentsProps={{
        typography: {
          sx: {display: "flex", alignItems: "center", overflow: "hidden"},
        },
      }}
      classes={{label: "full-width"}}
    />
  )
}
const SwitchFilter = (props) => {
  const location = useLocation()
  const locationParam = getParams(location, props.componentId)
  const theme = useTheme()
  const {t} = useTranslation(["translation", "conditionsOfAccess"])
  const {componentId, switchableFieldValue, defaultChecked, switchLabelKeyI18n} =
    props
  const [isChecked, setIsChecked] = useState(
    (locationParam != null && locationParam === '"' + switchableFieldValue + '"') ||
      defaultChecked
  )
  const toggleValue = () => {
    setIsChecked(!isChecked)
  }
  return (
    <Box sx={{marginX: theme.spacing(1.5)}}>
      <SingleDataList
        {...props}
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
              labelText={
                switchLabelKeyI18n
                  ? t(switchLabelKeyI18n)
                  : getLabelForStandardComponent(
                      switchableFieldValue,
                      componentId,
                      t
                    )
              }
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
