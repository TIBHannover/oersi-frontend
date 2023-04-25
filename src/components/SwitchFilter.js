import {SingleDataList} from "@appbaseio/reactivesearch"
import React, {useEffect, useState} from "react"
import {Box, Chip, FormControlLabel, Switch, useTheme} from "@mui/material"
import {useTranslation} from "next-i18next"
import {getLabelForStandardComponent, getParams} from "../helpers/helpers"
import {useRouter} from "next/router"

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
  const {t, i18n} = useTranslation(["translation", "labelledConcept"], {
    bindI18n: "languageChanged loaded",
  })
  const {componentId, switchableFieldValue, defaultChecked} = props
  const [isChecked, setIsChecked] = useState(
    (locationParam != null && locationParam === '"' + switchableFieldValue + '"') ||
      defaultChecked
  )
  const toggleValue = () => {
    setIsChecked(!isChecked)
  }
  useEffect(() => {
    i18n.reloadResources(i18n.resolvedLanguage, ["labelledConcept"])
  }, [])

  return (
    <Box sx={{margin: theme.spacing(2)}}>
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
              labelText={getLabelForStandardComponent(
                switchableFieldValue,
                componentId,
                t
              )}
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
